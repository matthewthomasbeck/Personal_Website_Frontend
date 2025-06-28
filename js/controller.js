// Helper: Parse query string
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const childDiv = document.querySelector('.childDiv');

function runGroupAccessLogic() {
  const idToken = window.sessionStorage.getItem('id_token');
  if (!idToken) {
    // Not logged in: leave the default HTML in place
    return;
  }
  // Decode JWT and check groups
  const payload = JSON.parse(atob(idToken.split('.')[1]));
  const groups = payload['cognito:groups'] || [];
  if (groups.includes('owner') || groups.includes('privileged')) {
    // Show video feed and controls
    childDiv.innerHTML = `
      <div id="videoContainer">
        <video id="robotVideo" autoplay playsinline muted>
          <p>Video stream loading...</p>
        </video>
        <div id="connectionStatus">🔴 Disconnected</div>
        <button id="connectButton" onclick="connectToRobot()">Connect</button>
      </div>
    `;
    
    // Initialize WebRTC after DOM is ready
    setTimeout(() => {
      initializeWebRTC();
    }, 100);
  } else {
    // Show access denied for non-privileged users
    childDiv.innerHTML = `
      <div class="statusBox denied">
        ❌ Access Denied – You are not in the 'owner' or 'privileged' group.
      </div>
      <h1>Access Denied</h1>
      <p>Please contact the site administrator if you believe this is an error.</p>
    `;
  }
}

// Always run on page load
runGroupAccessLogic();
// Also run when tokens become available
window.addEventListener('authTokensAvailable', runGroupAccessLogic);

// WebRTC and Robot Control Logic
let peerConnection = null;
let signalingSocket = null;
let robotConnected = false;

function initializeWebRTC() {
  // STUN servers for NAT traversal
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };
  
  peerConnection = new RTCPeerConnection(configuration);
  
  // Handle incoming video stream
  peerConnection.ontrack = function(event) {
    const video = document.getElementById('robotVideo');
    if (video) {
      video.srcObject = event.streams[0];
      updateConnectionStatus('🟢 Connected', 'success');
    }
  };
  
  // Handle connection state changes
  peerConnection.onconnectionstatechange = function() {
    console.log('Connection state:', peerConnection.connectionState);
    if (peerConnection.connectionState === 'connected') {
      robotConnected = true;
      updateConnectionStatus('🟢 Connected', 'success');
    } else if (peerConnection.connectionState === 'disconnected') {
      robotConnected = false;
      updateConnectionStatus('🔴 Disconnected', 'denied');
    }
  };
  
  // Handle ICE candidates
  peerConnection.onicecandidate = function(event) {
    if (event.candidate && signalingSocket) {
      signalingSocket.emit('ice-candidate', {
        candidate: event.candidate
      });
    }
  };
}

function connectToRobot() {
  const connectButton = document.getElementById('connectButton');
  if (!connectButton) return;
  
  if (robotConnected) {
    // Disconnect
    disconnectFromRobot();
    return;
  }
  
  // Connect to signaling server
  connectToSignalingServer();
  connectButton.textContent = 'Connecting...';
  connectButton.disabled = true;
}

function connectToSignalingServer() {
  // Connect to your signaling server using socket.io
  const signalingServerUrl = 'https://api.matthewthomasbeck.com';
  
  try {
    // Load socket.io client if not already loaded
    if (typeof io === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
      script.onload = () => {
        initializeSocketConnection(signalingServerUrl);
      };
      document.head.appendChild(script);
    } else {
      initializeSocketConnection(signalingServerUrl);
    }
    
  } catch (error) {
    console.error('Failed to connect to signaling server:', error);
    updateConnectionStatus('🔴 Connection failed', 'denied');
  }
}

function initializeSocketConnection(url) {
  signalingSocket = io(url, {
    transports: ['websocket'],
    upgrade: false
  });
  
  signalingSocket.on('connect', function() {
    console.log('Connected to signaling server');
    updateConnectionStatus('🟡 Connecting to robot...', 'pending');
    
    // Send authentication
    const idToken = window.sessionStorage.getItem('id_token');
    signalingSocket.emit('auth', {
      token: idToken
    });
  });
  
  signalingSocket.on('auth-success', function() {
    console.log('Authentication successful');
    updateConnectionStatus('🟡 Waiting for robot...', 'pending');
  });
  
  signalingSocket.on('auth-failed', function(data) {
    console.error('Authentication failed:', data.message);
    updateConnectionStatus('🔴 Authentication failed', 'denied');
    const connectButton = document.getElementById('connectButton');
    if (connectButton) {
      connectButton.textContent = 'Connect';
      connectButton.disabled = false;
    }
  });
  
  signalingSocket.on('robot-available', function() {
    console.log('Robot is available');
    updateConnectionStatus('🟡 Robot available - starting video...', 'pending');
    
    // Create and send WebRTC offer
    createAndSendOffer();
  });
  
  signalingSocket.on('robot-unavailable', function() {
    console.log('Robot is unavailable');
    updateConnectionStatus('🔴 Robot unavailable', 'denied');
  });
  
  signalingSocket.on('test-video-ready', function(data) {
    console.log('Test video ready:', data.message);
    updateConnectionStatus('🟡 Test video ready', 'pending');
  });
  
  signalingSocket.on('offer', function(data) {
    handleOffer(data.offer);
  });
  
  signalingSocket.on('answer', function(data) {
    handleAnswer(data.answer);
  });
  
  signalingSocket.on('ice-candidate', function(data) {
    if (peerConnection && data.candidate) {
      peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  });
  
  signalingSocket.on('command-ack', function(data) {
    console.log('Command acknowledged:', data);
  });
  
  signalingSocket.on('error', function(data) {
    console.error('Signaling error:', data.message);
    updateConnectionStatus('🔴 Error: ' + data.message, 'denied');
  });
  
  signalingSocket.on('disconnect', function() {
    console.log('Disconnected from signaling server');
    updateConnectionStatus('🔴 Disconnected', 'denied');
    const connectButton = document.getElementById('connectButton');
    if (connectButton) {
      connectButton.textContent = 'Connect';
      connectButton.disabled = false;
    }
  });
}

async function createAndSendOffer() {
  try {
    // Create a simple offer for testing
    const offer = await peerConnection.createOffer({
      offerToReceiveVideo: true,
      offerToReceiveAudio: false
    });
    
    await peerConnection.setLocalDescription(offer);
    
    if (signalingSocket) {
      signalingSocket.emit('offer', {
        offer: offer
      });
    }
    
    console.log('WebRTC offer sent');
    
  } catch (error) {
    console.error('Error creating offer:', error);
    updateConnectionStatus('🔴 Failed to create offer', 'denied');
  }
}

async function handleOffer(offer) {
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    
    if (signalingSocket) {
      signalingSocket.emit('answer', {
        answer: answer
      });
    }
  } catch (error) {
    console.error('Error handling offer:', error);
  }
}

async function handleAnswer(answer) {
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log('WebRTC answer processed');
  } catch (error) {
    console.error('Error handling answer:', error);
  }
}

function disconnectFromRobot() {
  if (signalingSocket) {
    signalingSocket.disconnect();
    signalingSocket = null;
  }
  
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  
  robotConnected = false;
  
  const video = document.getElementById('robotVideo');
  if (video) {
    video.srcObject = null;
  }
  
  const connectButton = document.getElementById('connectButton');
  if (connectButton) {
    connectButton.textContent = 'Connect';
    connectButton.disabled = false;
  }
  
  updateConnectionStatus('🔴 Disconnected', 'denied');
}

function updateConnectionStatus(message, type) {
  const statusElement = document.getElementById('connectionStatus');
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.className = `statusBox ${type}`;
  }
}

// Robot Control Functions
function sendRobotCommand(command) {
  if (signalingSocket && robotConnected) {
    signalingSocket.emit('robot-command', {
      command: command
    });
  }
}

// Keyboard event listeners for robot control
document.addEventListener('keydown', function(event) {
  if (!robotConnected) return;
  
  let command = null;
  
  switch(event.key.toLowerCase()) {
    case 'w':
    case 'arrowup':
      command = 'forward';
      break;
    case 's':
    case 'arrowdown':
      command = 'backward';
      break;
    case 'a':
    case 'arrowleft':
      command = 'left';
      break;
    case 'd':
    case 'arrowright':
      command = 'right';
      break;
    case ' ':
      command = 'stop';
      break;
  }
  
  if (command) {
    event.preventDefault();
    sendRobotCommand(command);
    updateStatus(`Command: ${command}`);
  }
});

document.addEventListener('keyup', function(event) {
  if (!robotConnected) return;
  
  const key = event.key.toLowerCase();
  if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
    sendRobotCommand('stop');
    updateStatus('Stopped');
  }
});

function updateStatus(message) {
  const statusElement = document.getElementById('status');
  if (statusElement) {
    statusElement.textContent = message;
  }
}