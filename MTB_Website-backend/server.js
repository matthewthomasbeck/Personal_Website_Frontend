const express = require('express');
const axios = require('axios');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const net = require('net');
require('dotenv').config();

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

// Create robot server on port 3000
const robotServer = net.createServer((socket) => {
  console.log('Robot connected from:', socket.remoteAddress);
  robotSocket = socket;
  robotConnected = true;

  // Notify all authenticated clients that robot is available
  connectedClients.forEach((client, clientId) => {
    if (client.authenticated) {
      io.to(clientId).emit('robot-available');
    }
  });

  socket.on('data', (data) => {
    console.log(`Received ${data.length} bytes from robot`);

    // Append new data to buffer
    robotBuffer = Buffer.concat([robotBuffer, data]);

    // Process complete frames
    while (robotBuffer.length >= 4) {
      // Read frame length (4 bytes)
      const frameLength = robotBuffer.readUInt32BE(0);

      // Check if we have a complete frame
      if (robotBuffer.length >= 4 + frameLength) {
        // Extract frame data
        const frameData = robotBuffer.slice(4, 4 + frameLength);

        // Forward video data to all authenticated clients
        connectedClients.forEach((client, clientId) => {
          if (client.authenticated && client.videoReady) {
            try {
              // The robot sends raw frame data (likely JPEG)
              // Convert to base64 for frontend consumption
              const frameBase64 = frameData.toString('base64');

              // Only send if we have valid data
              if (frameBase64.length > 0) {
                io.to(clientId).emit('video-frame', {
                  frame: frameBase64,
                  timestamp: Date.now()
                });
                console.log(`Sent video frame to client ${clientId}, size: ${frameLength} bytes`);
              }
            } catch (error) {
              console.error('Error processing video frame:', error);
            }
          }
        });

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

    // Notify all clients that robot is unavailable
    connectedClients.forEach((client, clientId) => {
      if (client.authenticated) {
        io.to(clientId).emit('robot-unavailable');
      }
    });
  });

  socket.on('error', (err) => {
    console.error('Robot socket error:', err);
    robotConnected = false;
    robotSocket = null;
  });
});

robotServer.listen(3000, '0.0.0.0', () => {
  console.log('Robot server listening on port 3000');
});

// WebSocket signaling for WebRTC
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle authentication
  socket.on('auth', async (data) => {
    try {
      // Verify the JWT token
      const token = data.token;
      if (!token) {
        socket.emit('auth-failed', { message: 'No token provided' });
        return;
      }

      // For now, just check if token exists (you can add more validation later)
      connectedClients.set(socket.id, { authenticated: true, token, videoReady: false });
      socket.emit('auth-success');
      console.log('Client authenticated:', socket.id);

      // If robot is already connected, notify client immediately
      if (robotConnected) {
        socket.emit('robot-available');
      }

    } catch (error) {
      console.error('Authentication error:', error);
      socket.emit('auth-failed', { message: 'Authentication failed' });
    }
  });

  // Handle WebRTC signaling
  socket.on('offer', (data) => {
    console.log('Received offer from client');

    const client = connectedClients.get(socket.id);
    if (client && client.authenticated) {
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

    // Forward command to robot if connected
    if (robotSocket && robotConnected) {
      try {
        // Send command with length prefix (matching robot's listen_for_commands format)
        const command = data.command;
        const commandBytes = Buffer.from(command, 'utf8');
        const lengthBuffer = Buffer.alloc(4);
        lengthBuffer.writeUInt32BE(commandBytes.length, 0);
        robotSocket.write(lengthBuffer);
        robotSocket.write(commandBytes);
        socket.emit('command-ack', {
          command: data.command,
          status: 'sent',
          timestamp: Date.now()
        });
        console.log(`Command sent to robot: ${command}`);
      } catch (error) {
        console.error('Error sending command to robot:', error);
        socket.emit('command-ack', {
          command: data.command,
          status: 'error',
          error: error.message,
          timestamp: Date.now()
        });
      }
    } else {
      socket.emit('command-ack', {
        command: data.command,
        status: 'robot_disconnected',
        timestamp: Date.now()
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedClients.delete(socket.id);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    clients: connectedClients.size,
    robotConnected: robotConnected,
    robotPort: 3000,
    webPort: process.env.PORT || 3001
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`)); 