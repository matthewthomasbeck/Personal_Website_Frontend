const express = require('express');
const axios = require('axios');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const net = require('net');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-client').default || require('jwks-client');
require('dotenv').config();

// Cognito configuration
const COGNITO_REGION = process.env.COGNITO_REGION || 'us-east-1';
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_ISSUER = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;

// Add debugging to check configuration
console.log('Cognito configuration:');
console.log('  Region:', COGNITO_REGION);
console.log('  User Pool ID:', COGNITO_USER_POOL_ID);
console.log('  Issuer:', COGNITO_ISSUER);

if (!COGNITO_USER_POOL_ID) {
  console.error('ERROR: COGNITO_USER_POOL_ID environment variable is not set!');
  console.error('Please add COGNITO_USER_POOL_ID to your .env file');
  process.exit(1);
}

// JWKS client for getting Cognito's public keys
const client = jwksClient({
  jwksUri: `${COGNITO_ISSUER}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: true,
    credentials: true
  }
});

// CORS middleware FIRST
app.use(cors({
  origin: true, // Reflects the request's origin
  credentials: true,
}));

// Explicitly handle OPTIONS preflight requests for CORS
app.options('/auth/token', cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add this endpoint for frontend token validation
app.post('/api/validate-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Validate the JWT token using Cognito's public key
    const payload = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, {
        algorithms: ['RS256'],
        issuer: COGNITO_ISSUER
      }, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
    
    // Check if user has required groups
    const groups = payload['cognito:groups'] || [];
    const hasAccess = groups.includes('owner') || groups.includes('privileged');
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    // Return user info (without sensitive data)
    res.json({
      valid: true,
      user: {
        sub: payload.sub,
        groups: groups,
        exp: payload.exp
      }
    });
    
  } catch (error) {
    console.error('Token validation failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Proxy endpoint for Cognito token exchange
app.post('/auth/token', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.COGNITO_CLIENT_ID);
    params.append('client_secret', process.env.COGNITO_CLIENT_SECRET);
    params.append('code', code);
    params.append('redirect_uri', redirectUri);

    const response = await axios.post(
        `https://${process.env.COGNITO_DOMAIN}/oauth2/token`,
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(400).json({ error: err.response?.data || err.message });
  }
});

// Robot bridge functionality
const connectedClients = new Map();
const robotConnections = new Map();
let robotSocket = null;
let robotConnected = false;
let robotBuffer = Buffer.alloc(0);
let activeClientId = null; // Track which client is currently controlling the robot
let activeSessionId = null; // Track which session is currently controlling the robot

// Create robot server on port 3000
const robotServer = net.createServer((socket) => {
  console.log('Robot connected from:', socket.remoteAddress);
  robotSocket = socket;
  robotConnected = true;

  // Notify the active client that robot is available (if there is one)
  if (activeClientId) {
    io.to(activeClientId).emit('robot-available');
  }
});

robotServer.listen(3000, '0.0.0.0', () => {
  console.log('Robot server listening on port 3000');
});

// Add this function near the top or before the io.on('connection') block
function sanitizeKeys(keys) {
  // keys: array of strings
  const opposites = [
    ['w', 's'],
    ['a', 'd'],
    ['arrowup', 'arrowdown'],
    ['arrowleft', 'arrowright']
  ];
  let keySet = new Set(keys);
  opposites.forEach(([k1, k2]) => {
    if (keySet.has(k1) && keySet.has(k2)) {
      keySet.delete(k1);
      keySet.delete(k2);
    }
  });
  return Array.from(keySet);
}

// WebSocket signaling for WebRTC
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle authentication
  socket.on('auth', async (data) => {
    try {
      const token = data.token;
      if (!token) {
        socket.emit('auth-failed', { message: 'No token provided' });
        return;
      }

      // PROPER JWT validation
      const payload = await new Promise((resolve, reject) => {
        jwt.verify(token, getKey, {
          algorithms: ['RS256'],
          issuer: COGNITO_ISSUER
        }, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        });
      });

      // Now safely extract session ID
      const sessionId = payload.sub;
      
      // Check groups
      const groups = payload['cognito:groups'] || [];
      const hasAccess = groups.includes('owner') || groups.includes('privileged');
      
      if (!hasAccess) {
        socket.emit('auth-failed', { message: 'Insufficient permissions' });
        return;
      }

      // Check if this session is already controlling the robot
      if (activeSessionId && activeSessionId === sessionId) {
        // This session is already active, allow this connection
        connectedClients.set(socket.id, { authenticated: true, token, videoReady: false, sessionId });
        socket.emit('auth-success');
        console.log('Client authenticated (existing session):', socket.id);
        
        // Update active client ID to this new socket
        activeClientId = socket.id;
        
        // If robot is already connected, notify client immediately
        if (robotConnected) {
          socket.emit('robot-available');
        }
        return;
      }

      // Check if robot is already in use by another session
      if (activeSessionId && activeSessionId !== sessionId) {
        socket.emit('robot-in-use', { message: 'Robot is currently in use by another user.' });
        return;
      }

      // For now, just check if token exists (you can add more validation later)
      connectedClients.set(socket.id, { authenticated: true, token, videoReady: false, sessionId });
      socket.emit('auth-success');
      console.log('Client authenticated:', socket.id);

      // Set this client as the active client and session
      activeClientId = socket.id;
      activeSessionId = sessionId;

      // If robot is already connected, notify client immediately
      if (robotConnected) {
        socket.emit('robot-available');
      }

    } catch (error) {
      console.error('JWT validation failed:', error);
      socket.emit('auth-failed', { message: 'Invalid token' });
    }
  });

  // Handle WebRTC signaling
  socket.on('offer', (data) => {
    console.log('Received offer from client');

    const client = connectedClients.get(socket.id);
    if (client && client.authenticated && activeClientId === socket.id) {
      client.videoReady = true;

      // Send back an answer (simplified for now)
      setTimeout(() => {
        socket.emit('answer', {
          answer: {
            type: 'answer',
            sdp: 'v=0\r\no=- 0 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=msid-semantic: WMS\r\nm=video 9 UDP/TLS/RTP/SAVPF 96\r\nc=IN IP4 0.0.0.0\r\na=mid:0\r\na=sendonly\r\na=rtpmap:96 H264/90000\r\n'
          }
        });
      }, 1000);
    }
  });

  socket.on('answer', (data) => {
    console.log('Received answer from client');
  });

  socket.on('ice-candidate', (data) => {
    console.log('Received ICE candidate from client');
    // Echo back for testing
    socket.emit('ice-candidate', data);
  });

  // Handle robot commands
  socket.on('robot-command', (data) => {
    console.log('Robot command received:', data.command);

    // Only allow commands from the active client
    if (activeClientId !== socket.id) {
      socket.emit('command-ack', {
        command: data.command,
        status: 'unauthorized',
        message: 'You are not the active controller',
        timestamp: Date.now()
      });
      return;
    }

    // Sanitize keys if the command is a key combination
    let commandToSend = data.command;
    if (typeof commandToSend === 'string' && commandToSend.includes('+')) {
      let keys = commandToSend.split('+');
      keys = sanitizeKeys(keys);
      commandToSend = keys.join('+');
    }

    // Forward command to robot if connected
    if (robotSocket && robotConnected) {
      try {
        // Send command with length prefix (matching robot's listen_for_commands format)
        const commandBytes = Buffer.from(commandToSend, 'utf8');
        const lengthBuffer = Buffer.alloc(4);
        lengthBuffer.writeUInt32BE(commandBytes.length, 0);
        robotSocket.write(lengthBuffer);
        robotSocket.write(commandBytes);
        socket.emit('command-ack', {
          command: commandToSend,
          status: 'sent',
          timestamp: Date.now()
        });
        console.log(`Command sent to robot: ${commandToSend}`);
      } catch (error) {
        console.error('Error sending command to robot:', error);
        socket.emit('command-ack', {
          command: commandToSend,
          status: 'error',
          error: error.message,
          timestamp: Date.now()
        });
      }
    } else {
      socket.emit('command-ack', {
        command: commandToSend,
        status: 'robot_disconnected',
        timestamp: Date.now()
      });
    }
  });

  // Handle client leaving (manual disconnect)
  socket.on('leave-robot', () => {
    console.log('Client leaving robot control:', socket.id);
    if (activeClientId === socket.id) {
      activeClientId = null;
      activeSessionId = null;
      // Notify all authenticated clients that robot is now available
      connectedClients.forEach((client, clientId) => {
        if (client.authenticated) {
          io.to(clientId).emit('robot-available');
        }
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    const client = connectedClients.get(socket.id);
    
    // If this was the active client, clear the active client and notify others
    if (activeClientId === socket.id) {
      activeClientId = null;
      activeSessionId = null;
      console.log('Active client disconnected, robot is now available');
      
      // Notify all remaining authenticated clients that robot is available
      connectedClients.forEach((client, clientId) => {
        if (client.authenticated && clientId !== socket.id) {
          io.to(clientId).emit('robot-available');
        }
      });
    }
    
    connectedClients.delete(socket.id);
  });
});

// Add at the top, after other variable declarations
const MAX_FRAME_SIZE = 2 * 1024 * 1024; // 2MB max frame size for sanity check

// Log buffer size every 10 seconds
setInterval(() => {
  if (robotBuffer.length > 0) {
    console.log('Current robotBuffer size:', robotBuffer.length);
  }
}, 10000); // every 10 seconds

// Log memory usage every minute
setInterval(() => {
  const mem = process.memoryUsage();
  console.log('Memory usage:', mem);
}, 60000); // every minute

// Handle robot socket events
robotServer.on('connection', (socket) => {
  socket.on('data', (data) => {
    console.log(`Received ${data.length} bytes from robot`);

    // Append new data to buffer
    robotBuffer = Buffer.concat([robotBuffer, data]);

    // Process complete frames
    while (robotBuffer.length >= 4) {
      // Read frame length (4 bytes)
      const frameLength = robotBuffer.readUInt32BE(0);

      // Sanity check for frame length
      if (frameLength <= 0 || frameLength > MAX_FRAME_SIZE) {
        console.error('Invalid frame length:', frameLength, 'Clearing buffer.');
        robotBuffer = Buffer.alloc(0);
        break;
      }

      // Check if we have a complete frame
      if (robotBuffer.length >= 4 + frameLength) {
        // Extract frame data
        const frameData = robotBuffer.slice(4, 4 + frameLength);

        // Forward video data only to the active client
        if (activeClientId) {
          const activeClient = connectedClients.get(activeClientId);
          if (activeClient && activeClient.authenticated && activeClient.videoReady) {
            try {
              // The robot sends raw frame data (likely JPEG)
              // Convert to base64 for frontend consumption
              const frameBase64 = frameData.toString('base64');

              // Only send if we have valid data
              if (frameBase64.length > 0) {
                io.to(activeClientId).emit('video-frame', {
                  frame: frameBase64,
                  timestamp: Date.now()
                });
                console.log(`Sent video frame to active client ${activeClientId}, size: ${frameLength} bytes`);
              } else {
                console.warn('Frame base64 is empty, skipping emit.');
              }
            } catch (error) {
              console.error('Error processing video frame:', error);
            }
          }
        }

        // Remove processed frame from buffer
        robotBuffer = robotBuffer.slice(4 + frameLength);
      } else {
        // Incomplete frame, wait for more data
        break;
      }
    }
  });

  socket.on('close', () => {
    console.log('Robot disconnected');
    robotConnected = false;
    robotSocket = null;
    robotBuffer = Buffer.alloc(0); // Clear buffer on disconnect

    // Notify the active client that robot is unavailable
    if (activeClientId) {
      io.to(activeClientId).emit('robot-unavailable');
    }
  });

  socket.on('error', (err) => {
    console.error('Robot socket error:', err);
    robotConnected = false;
    robotSocket = null;
    robotBuffer = Buffer.alloc(0); // Clear buffer on error
    
    // Notify the active client that robot is unavailable
    if (activeClientId) {
      io.to(activeClientId).emit('robot-unavailable');
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    clients: connectedClients.size,
    activeClient: activeClientId,
    activeSession: activeSessionId,
    robotConnected: robotConnected,
    robotPort: 3000,
    webPort: process.env.PORT || 3001
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));