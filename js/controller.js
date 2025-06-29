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
        <div id="status">Ready to connect</div>
        <div class="controlInstructions">
          <h3>Robot Controls</h3>
          <ul>
            <li><strong>W/↑</strong> - Move Forward</li>
            <li><strong>S/↓</strong> - Move Backward</li>
            <li><strong>A/←</strong> - Turn Left</li>
            <li><strong>D/→</strong> - Turn Right</li>
            <li><strong>Space</strong> - Neutral Position</li>
            <li><strong>Q</strong> - Exit</li>
          </ul>
        </div>
      </div>
    `;

    // Initialize video handling after DOM is ready
    setTimeout(() => {
      initializeVideoHandling();
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

// Video and Robot Control Logic
let signalingSocket = null;
let robotConnected = false;
let videoCanvas = null;
let videoContext = null;

function initializeVideoHandling() {
  // Create canvas for video display
  const video = document.getElementById('robotVideo');
  if (video) {
    videoCanvas = document.createElement('canvas');
    // Make canvas larger to better fit the screen
    videoCanvas.width = 1280;  // Increased from 640
    videoCanvas.height = 720;  // Increased from 480
    videoContext = videoCanvas.getContext('2d');

    // Replace video element with canvas
    video.parentNode.replaceChild(videoCanvas, video);
  }
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
    robotConnected = true;

    // Create and send WebRTC offer to establish video connection
    createAndSendOffer();
  });

  signalingSocket.on('robot-unavailable', function() {
    console.log('Robot is unavailable');
    robotConnected = false;
    updateConnectionStatus('🔴 Robot unavailable', 'denied');
    const connectButton = document.getElementById('connectButton');
    if (connectButton) {
      connectButton.textContent = 'Connect';
      connectButton.disabled = false;
    }
  });

  // Handle video frames from backend
  signalingSocket.on('video-frame', function(data) {
    if (videoContext && robotConnected && data.frame) {
      try {
        // Convert base64 frame to image and display on canvas
        const img = new Image();
        img.onload = function() {
          try {
            videoContext.drawImage(img, 0, 0, videoCanvas.width, videoCanvas.height);
            updateStatus('Video streaming');
          } catch (drawError) {
            console.error('Error drawing image to canvas:', drawError);
          }
        };
        img.onerror = function() {
          console.error('Error loading video frame image');
        };
        img.src = 'data:image/jpeg;base64,' + data.frame;
      } catch (error) {
        console.error('Error displaying video frame:', error);
      }
    }
  });

  signalingSocket.on('offer', function(data) {
    handleOffer(data.offer);
  });

  signalingSocket.on('answer', function(data) {
    handleAnswer(data.answer);
  });

  signalingSocket.on('ice-candidate', function(data) {
    // Handle ICE candidates if needed for WebRTC
  });

  signalingSocket.on('command-ack', function(data) {
    console.log('Command acknowledged:', data);
    if (data.status === 'sent') {
      updateStatus(`Command sent: ${data.command}`);
    } else if (data.status === 'error') {
      updateStatus(`Command error: ${data.error}`);
    } else if (data.status === 'robot_disconnected') {
      updateStatus('Robot disconnected');
      robotConnected = false;
      updateConnectionStatus('🔴 Robot disconnected', 'denied');
    }
  });

  signalingSocket.on('error', function(data) {
    console.error('Signaling error:', data.message);
    updateConnectionStatus('🔴 Error: ' + data.message, 'denied');
  });

  signalingSocket.on('disconnect', function() {
    console.log('Disconnected from signaling server');
    robotConnected = false;
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
    // Send a simple offer to establish video connection
    if (signalingSocket) {
      signalingSocket.emit('offer', {
        offer: {
          type: 'offer',
          sdp: 'v=0\r\no=- 0 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=msid-semantic: WMS\r\nm=video 9 UDP/TLS/RTP/SAVPF 96\r\nc=IN IP4 0.0.0.0\r\na=mid:0\r\na=recvonly\r\na=rtpmap:96 H264/90000\r\n'
        }
      });
    }

    console.log('Video connection offer sent');
    updateConnectionStatus('🟢 Connected - Video streaming', 'success');

  } catch (error) {
    console.error('Error creating offer:', error);
    updateConnectionStatus('🔴 Failed to create offer', 'denied');
  }
}

async function handleOffer(offer) {
  try {
    // Handle incoming offer if needed
    console.log('Offer received');
  } catch (error) {
    console.error('Error handling offer:', error);
  }
}

async function handleAnswer(answer) {
  try {
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

  robotConnected = false;

  // Clear video canvas
  if (videoContext) {
    videoContext.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  }

  const connectButton = document.getElementById('connectButton');
  if (connectButton) {
    connectButton.textContent = 'Connect';
    connectButton.disabled = false;
  }

  updateConnectionStatus('🔴 Disconnected', 'denied');
  updateStatus('Disconnected from robot');
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
      command = 'w';
      break;
    case 's':
    case 'arrowdown':
      command = 's';
      break;
    case 'a':
    case 'arrowleft':
      command = 'a';
      break;
    case 'd':
    case 'arrowright':
      command = 'd';
      break;
    case ' ':
      command = 'n';
      break;
    case 'q':
      command = 'q';
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
    sendRobotCommand('n'); // Send neutral command when key is released
    updateStatus('Neutral position');
  }
});

function updateStatus(message) {
  const statusElement = document.getElementById('status');
  if (statusElement) {
    statusElement.textContent = message;
  }
}