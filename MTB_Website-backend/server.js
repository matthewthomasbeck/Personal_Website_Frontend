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
      
    } catch (error) {
      console.error('Authentication error:', error);
      socket.emit('auth-failed', { message: 'Authentication failed' });
    }
  });
  
  // Handle WebRTC signaling
  socket.on('offer', (data) => {
    // Forward offer to robot
    const robotSocket = getRobotSocket();
    if (robotSocket) {
      robotSocket.emit('offer', data);
    } else {
      socket.emit('error', { message: 'Robot not connected' });
    }
  });
  
  socket.on('answer', (data) => {
    // Forward answer to robot
    const robotSocket = getRobotSocket();
    if (robotSocket) {
      robotSocket.emit('answer', data);
    }
  });
  
  socket.on('ice-candidate', (data) => {
    // Forward ICE candidate to robot
    const robotSocket = getRobotSocket();
    if (robotSocket) {
      robotSocket.emit('ice-candidate', data);
    }
  });
  
  // Handle robot commands
  socket.on('robot-command', (data) => {
    const robotSocket = getRobotSocket();
    if (robotSocket) {
      robotSocket.emit('robot-command', data);
      console.log('Robot command sent:', data.command);
    } else {
      socket.emit('error', { message: 'Robot not connected' });
    }
  });
  
  // Handle robot connections
  socket.on('robot-connect', () => {
    robotConnections.set(socket.id, socket);
    console.log('Robot connected:', socket.id);
    // Notify all clients that robot is available
    io.emit('robot-available');
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedClients.delete(socket.id);
    
    // Check if this was a robot connection
    if (robotConnections.has(socket.id)) {
      robotConnections.delete(socket.id);
      console.log('Robot disconnected:', socket.id);
      // Notify all clients that robot is unavailable
      io.emit('robot-unavailable');
    }
  });
});

// Helper function to get robot socket
function getRobotSocket() {
  const robotIds = Array.from(robotConnections.keys());
  return robotIds.length > 0 ? robotConnections.get(robotIds[0]) : null;
}

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