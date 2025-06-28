const express = require('express');
const axios = require('axios');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
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

// WebSocket signaling for WebRTC
const connectedClients = new Map();
const robotConnections = new Map();

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
      connectedClients.set(socket.id, { authenticated: true, token });
      socket.emit('auth-success');
      console.log('Client authenticated:', socket.id);
      
      // Simulate robot availability after authentication
      setTimeout(() => {
        socket.emit('robot-available');
      }, 1000);
      
    } catch (error) {
      console.error('Authentication error:', error);
      socket.emit('auth-failed', { message: 'Authentication failed' });
    }
  });
  
  // Handle WebRTC signaling - for now, just acknowledge
  socket.on('offer', (data) => {
    console.log('Received offer from client');
    
    // For testing, we'll just acknowledge the offer
    // In the real implementation, this would create a video stream
    socket.emit('test-video-ready', { 
      message: 'Test video stream ready',
      timestamp: Date.now()
    });
    
    // Simulate sending back an answer (simplified for testing)
    setTimeout(() => {
      socket.emit('answer', { 
        answer: {
          type: 'answer',
          sdp: 'v=0\r\no=- 0 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=msid-semantic: WMS\r\nm=video 9 UDP/TLS/RTP/SAVPF 96\r\nc=IN IP4 0.0.0.0\r\na=mid:0\r\na=sendonly\r\na=rtpmap:96 H264/90000\r\n'
        }
      });
    }, 1000);
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
    // In the future, this will forward to the actual robot
    // For now, just log the command and acknowledge
    socket.emit('command-ack', { 
      command: data.command, 
      status: 'received',
      timestamp: Date.now()
    });
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
    robots: robotConnections.size
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`)); 