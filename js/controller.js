// Helper: Parse query string
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const childDiv = document.querySelector('.childDiv');

async function validateUserAccess() {
  const idToken = window.sessionStorage.getItem('id_token');
  
  if (!idToken) {
    showAccessDenied('You must be logged in.');
    return false;
  }
  
  try {
    // Send token to backend for validation
    const response = await fetch('https://api.matthewthomasbeck.com/api/validate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: idToken })
    });
    
    if (!response.ok) {
      throw new Error('Token validation failed');
    }
    
    const userData = await response.json();
    return userData.valid && (userData.user.groups.includes('owner') || userData.user.groups.includes('privileged'));
    
  } catch (error) {
    console.error('Authentication failed:', error);
    showAccessDenied('Invalid or expired token. Please log in again.');
    return false;
  }
}

async function runGroupAccessLogic() {
  const hasAccess = await validateUserAccess();
  
  if (!hasAccess) {
    return; // Access denied message already shown
  }
  
  // User is validated - show robot controls
  showRobotControls();
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
let isActiveController = false;

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

  connectButton.classList.add('standardFont');

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
    console.log('🔴 Connection failed');
  }
}

function initializeSocketConnection(url) {
  signalingSocket = io(url, {
    transports: ['websocket'],
    upgrade: false
  });

  signalingSocket.on('connect', function() {
    console.log('Connected to signaling server');
    console.log('🟡 Connecting to robot...');

    // Send authentication
    const idToken = window.sessionStorage.getItem('id_token');
    signalingSocket.emit('auth', {
      token: idToken
    });
  });

  signalingSocket.on('auth-success', function() {
    console.log('Authentication successful');
    console.log('🟡 Waiting for robot...');
  });

  signalingSocket.on('auth-failed', function(data) {
    console.error('Authentication failed:', data.message);
    console.log('🔴 Authentication failed');
    const connectButton = document.getElementById('connectButton');
    if (connectButton) {
      connectButton.textContent = 'Connect';
      connectButton.disabled = false;
    }
  });

  // Handle robot-in-use message
  signalingSocket.on('robot-in-use', function(data) {
    console.log('Robot is currently in use:', data.message);
    console.log('🔴 Robot is currently in use by another user');
    console.log('Waiting for robot to become available...');

    const connectButton = document.getElementById('connectButton');
    if (connectButton) {
      connectButton.textContent = 'Waiting...';
      connectButton.disabled = true;
    }
  });

  signalingSocket.on('robot-available', function() {
    console.log('Robot is available');

    // If we're not already connected, automatically connect
    if (!robotConnected) {
      console.log('🟡 Robot available - starting video...');
      robotConnected = true;
      isActiveController = true;

      // Create and send WebRTC offer to establish video connection
      createAndSendOffer();

      // Hide connect button and show leave button
      const connectButton = document.getElementById('connectButton');
      const leaveButton = document.getElementById('leaveButton');
      if (connectButton) {
        connectButton.style.display = 'none';
      }
      if (leaveButton) {
        leaveButton.style.display = 'inline-block';
      }
      startVideoTimeoutWatchdog();
    }
  });

  signalingSocket.on('robot-unavailable', function() {
    console.log('Robot is unavailable');
    robotConnected = false;
    isActiveController = false;
    console.log('🔴 Robot unavailable');

    const connectButton = document.getElementById('connectButton');
    const leaveButton = document.getElementById('leaveButton');
    if (connectButton) {
      connectButton.style.display = 'inline-block';
      connectButton.disabled = false;
    }
    if (leaveButton) {
      leaveButton.style.display = 'none';
    }
  });

  // Handle video frames from backend
  signalingSocket.on('video-frame', function(data) {
    lastVideoFrameTime = Date.now();
    if (videoContext && robotConnected && isActiveController && data.frame) {
      try {
        // Convert base64 frame to image and display on canvas
        const img = new Image();
        img.onload = function() {
          try {
            videoContext.drawImage(img, 0, 0, videoCanvas.width, videoCanvas.height);
            console.log('Video streaming');
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
      console.log(`Command sent: ${data.command}`);
    } else if (data.status === 'error') {
      console.log(`Command error: ${data.error}`);
    } else if (data.status === 'unauthorized') {
      console.log(`Unauthorized: ${data.message}`);
      // If we're not the active controller, update our state
      if (!isActiveController) {
        robotConnected = false;
        console.log('🔴 Not the active controller');
      }
    } else if (data.status === 'robot_disconnected') {
      console.log('Robot disconnected');
      robotConnected = false;
      isActiveController = false;
      console.log('🔴 Robot disconnected');
    }
  });

  signalingSocket.on('error', function(data) {
    console.error('Signaling error:', data.message);
    console.log('🔴 Error: ' + data.message);
  });

  signalingSocket.on('disconnect', function() {
    console.log('Disconnected from signaling server');
    robotConnected = false;
    isActiveController = false;
    console.log('🔴 Disconnected');

    const connectButton = document.getElementById('connectButton');
    const leaveButton = document.getElementById('leaveButton');
    if (connectButton) {
      connectButton.style.display = 'inline-block';
      connectButton.disabled = false;
    }
    if (leaveButton) {
      leaveButton.style.display = 'none';
    }
    hideVideoError();
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
    console.log('🟢 Connected - Video streaming');

  } catch (error) {
    console.error('Error creating offer:', error);
    console.log('🔴 Failed to create offer');
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

function leaveRobot() {
  if (signalingSocket && isActiveController) {
    signalingSocket.emit('leave-robot');
  }
  disconnectFromRobot();
}

function disconnectFromRobot() {
  if (signalingSocket) {
    signalingSocket.disconnect();
    signalingSocket = null;
  }

  robotConnected = false;
  isActiveController = false;

  // Clear video canvas
  if (videoContext) {
    videoContext.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  }

  const connectButton = document.getElementById('connectButton');
  const leaveButton = document.getElementById('leaveButton');
  if (connectButton) {
    connectButton.style.display = 'inline-block';
    connectButton.disabled = false;
  }
  if (leaveButton) {
    leaveButton.style.display = 'none';
  }
  hideVideoError();
  console.log('🔴 Disconnected');
  console.log('Disconnected from robot');
}

// Robot Control Functions
function sendRobotCommand(command) {
  if (signalingSocket && robotConnected && isActiveController) {
    signalingSocket.emit('robot-command', {
      command: command
    });
  }
}

// --- KEYBOARD CONTROL: Track all pressed keys and send as a set ---
let pressedKeys = new Set();
let keyInterval = null;

function sendCurrentKeys() {
  if (robotConnected && isActiveController) {
    if (pressedKeys.size > 0) {
      sendRobotCommand(Array.from(pressedKeys).join('+'));
    } else {
      sendRobotCommand('n');
    }
  }
}

document.addEventListener('keydown', function(event) {
  if (!robotConnected || !isActiveController) return;
  const key = event.key.toLowerCase();
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
    pressedKeys.add(key);
    if (!keyInterval) {
      keyInterval = setInterval(sendCurrentKeys, 100); // Send every 100ms while keys are held
    }
    event.preventDefault();
  }
});

document.addEventListener('keyup', function(event) {
  if (!robotConnected || !isActiveController) return;
  const key = event.key.toLowerCase();
  if (pressedKeys.has(key)) {
    pressedKeys.delete(key);
    if (pressedKeys.size === 0) {
      sendRobotCommand('n');
      clearInterval(keyInterval);
      keyInterval = null;
    }
  }
});

// --- Video Timeout/Error Overlay Logic ---
let lastVideoFrameTime = null;
let videoTimeoutInterval = null;
const VIDEO_TIMEOUT_MS = 5000; // 5 seconds

function showVideoError(message) {
  let errorDiv = document.getElementById('videoErrorOverlay');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'videoErrorOverlay';
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = 'calc(var(--navBarTop, 0px) + 15px)';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translateX(-50%)';
    errorDiv.style.background = 'rgba(255,0,0,0.85)';
    errorDiv.style.color = '#fff';
    errorDiv.style.padding = '12px 32px';
    errorDiv.style.borderRadius = '8px';
    errorDiv.style.zIndex = '10000';
    errorDiv.style.fontSize = '1.2em';
    errorDiv.style.textAlign = 'center';
    document.body.appendChild(errorDiv);
  }
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}
function hideVideoError() {
  const errorDiv = document.getElementById('videoErrorOverlay');
  if (errorDiv) errorDiv.style.display = 'none';
}

// Start the video timeout watchdog after socket connection is established
function startVideoTimeoutWatchdog() {
  if (videoTimeoutInterval) clearInterval(videoTimeoutInterval);
  videoTimeoutInterval = setInterval(() => {
    if (robotConnected && isActiveController) {
      if (!lastVideoFrameTime || Date.now() - lastVideoFrameTime > VIDEO_TIMEOUT_MS) {
        showVideoError('No video received from robot. Please check connection.');
      } else {
        hideVideoError();
      }
    } else {
      hideVideoError();
    }
  }, 1000);
}

// Handle window resize and orientation changes
window.addEventListener('resize', function() {
  // Re-run the group access logic to update the interface for new screen size
  setTimeout(() => {
    runGroupAccessLogic();
  }, 100);
});

// Handle orientation change specifically
window.addEventListener('orientationchange', function() {
  // Wait for orientation change to complete, then update
  setTimeout(() => {
    runGroupAccessLogic();
  }, 500);
});