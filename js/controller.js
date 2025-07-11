// Helper: Parse query string
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const childDiv = document.querySelector('.childDiv');

function runGroupAccessLogic() {
  const idToken = window.sessionStorage.getItem('id_token');
  if (!idToken) {
    // Not logged in: show video container full screen, with overlayed message
    childDiv.innerHTML = `
      <div id="videoContainer">
        <div id="loginOverlay" style="position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; z-index: 10;">
          <div class="statusBox denied" style="font-size: 1.2em;">
            ❌ Access Denied – You must be logged in.
          </div>
        </div>
      </div>
    `;
    return;
  }
  // Decode JWT and check groups
  const payload = JSON.parse(atob(idToken.split('.')[1]));
  const groups = payload['cognito:groups'] || [];
  if (groups.includes('owner') || groups.includes('privileged')) {
    // Check if device is mobile
    const isMobile = window.innerWidth <= 1024;
    
    if (isMobile) {
      // Mobile version with 8 arrow controls and landscape enforcement
      childDiv.innerHTML = `
        <div id="videoContainer">
          <div id="landscapeOverlay" style="display:none;">
            <div class="landscapeMessage">
              <span>Please rotate your phone horizontally to control the robot.</span>
            </div>
          </div>
          <video id="robotVideo" autoplay playsinline muted>
            <p>Video stream loading...</p>
          </video>
          <button id="connectButton" onclick="connectToRobot()">Connect</button>
          <div id="connectionStatus">🔴 Disconnected</div>
          <button id="leaveButton" onclick="leaveRobot()" style="display: none;">Leave Robot</button>
          <button id="controlModeToggle" onclick="toggleControlMode()">Switch to Keyboard</button>
          <!-- Mobile 8-Button Controls -->
          <div id="mobileControls8">
            <div class="mobileControlsLeft">
              <div class="controlRow controlRowUpDown">
                <button class="controlBtn arrowBtn" id="lookUpBtn" data-command="arrowup">
                  <img src="https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/assets/icons/arrow-north.png" alt="Look Up">
                </button>
              </div>
              <div class="controlRow controlRowLRD">
                <button class="controlBtn arrowBtn" id="lookLeftBtn" data-command="arrowleft">
                  <img src="https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/assets/icons/arrow-west.png" alt="Look Left">
                </button>
                <button class="controlBtn arrowBtn" id="lookDownBtn" data-command="arrowdown">
                  <img src="https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/assets/icons/arrow-south.png" alt="Look Down">
                </button>
                <button class="controlBtn arrowBtn" id="lookRightBtn" data-command="arrowright">
                  <img src="https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/assets/icons/arrow-east.png" alt="Look Right">
                </button>
              </div>
            </div>
            <div class="mobileControlsRight">
              <div class="controlRow controlRowUpDown">
                <button class="controlBtn wasdBtn" id="moveUpBtn" data-command="w">
                  <img src="https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/assets/icons/arrow-north.png" alt="Move Forward">
                </button>
              </div>
              <div class="controlRow controlRowLRD">
                <button class="controlBtn wasdBtn" id="moveLeftBtn" data-command="a">
                  <img src="https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/assets/icons/arrow-west.png" alt="Move Left">
                </button>
                <button class="controlBtn wasdBtn" id="moveDownBtn" data-command="s">
                  <img src="https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/assets/icons/arrow-south.png" alt="Move Backward">
                </button>
                <button class="controlBtn wasdBtn" id="moveRightBtn" data-command="d">
                  <img src="https://s3.us-east-2.amazonaws.com/cdn.matthewthomasbeck.com/assets/icons/arrow-east.png" alt="Move Right">
                </button>
              </div>
            </div>
          </div>
          <!-- Mobile Action Buttons -->
          <div id="mobileActionButtons">
            <button class="actionBtn" id="actionBtn" onclick="sendRobotCommand('action')">Action</button>
            <button class="actionBtn" id="jumpBtn" onclick="sendRobotCommand('jump')">Jump</button>
          </div>
        </div>
      `;
      // Landscape enforcement logic
      setTimeout(() => {
        function checkOrientation() {
          const overlay = document.getElementById('landscapeOverlay');
          if (window.innerWidth < window.innerHeight) {
            overlay.style.display = 'flex';
            if (document.getElementById('mobileControls8')) document.getElementById('mobileControls8').style.display = 'none';
            if (document.getElementById('mobileActionButtons')) document.getElementById('mobileActionButtons').style.display = 'none';
          } else {
            overlay.style.display = 'none';
            if (document.getElementById('mobileControls8')) document.getElementById('mobileControls8').style.display = 'flex';
            if (document.getElementById('mobileActionButtons')) document.getElementById('mobileActionButtons').style.display = 'flex';
          }
        }
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);
        checkOrientation();
      }, 200);
      // Hold-to-repeat logic for mobile controls
      setTimeout(() => {
        const btns = document.querySelectorAll('#mobileControls8 .controlBtn');
        btns.forEach(btn => {
          let interval = null;
          let isTouch = false;
          const command = btn.getAttribute('data-command');
          const send = () => sendRobotCommand(command);
          // Mouse events
          btn.addEventListener('mousedown', e => {
            if (interval) clearInterval(interval);
            send();
            interval = setInterval(send, 100);
          });
          btn.addEventListener('mouseup', e => {
            if (interval) clearInterval(interval);
            sendRobotCommand('n');
          });
          btn.addEventListener('mouseleave', e => {
            if (interval) clearInterval(interval);
            sendRobotCommand('n');
          });
          // Touch events
          btn.addEventListener('touchstart', e => {
            isTouch = true;
            if (interval) clearInterval(interval);
            send();
            interval = setInterval(send, 100);
          });
          btn.addEventListener('touchend', e => {
            if (interval) clearInterval(interval);
            sendRobotCommand('n');
          });
          btn.addEventListener('touchcancel', e => {
            if (interval) clearInterval(interval);
            sendRobotCommand('n');
          });
        });
      }, 300);
    } else {
      // Desktop version with keyboard controls
    childDiv.innerHTML = `
      <div id="videoContainer">
        <video id="robotVideo" autoplay playsinline muted>
          <p>Video stream loading...</p>
        </video>
        <button id="connectButton" onclick="connectToRobot()">Connect</button>
        <div id="connectionStatus">🔴 Disconnected</div>
        <button id="leaveButton" onclick="leaveRobot()" style="display: none;">Leave Robot</button>
        <button id="controlModeToggle" onclick="toggleControlMode()">Switch to Mobile</button>
        <div class="controlInstructions">
          <h3>Robot Controls</h3>
          <ul>
            <li><strong>W/↑</strong> - Move Forward</li>
            <li><strong>S/↓</strong> - Move Backward</li>
            <li><strong>A/←</strong> - Turn Left</li>
            <li><strong>D/→</strong> - Turn Right</li>
            <li><strong>Mouse</strong> - Look Around</li>
            <li><strong>Space</strong> - Jump</li>
            <li><strong>Left Click</strong> - Action</li>
          </ul>
        </div>
      </div>
    `;
    }

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
let isActiveController = false;
let isMouseControlEnabled = false;
let lastMouseX = 0;
let lastMouseY = 0;
let mouseSensitivity = 0.5;

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
  
  // Add click handler to video container for mouse control
  const videoContainer = document.getElementById('videoContainer');
  if (videoContainer) {
    videoContainer.addEventListener('click', function() {
      const isMobile = window.innerWidth <= 1024;
      if (!isMobile && robotConnected && isActiveController) {
        enableMouseControl();
      }
    });
  }
}

function toggleControlMode() {
  const isMobile = window.innerWidth <= 1024;
  const toggleButton = document.getElementById('controlModeToggle');
  
  if (isMobile) {
    // Switch to keyboard mode on mobile
    if (toggleButton) {
      toggleButton.textContent = 'Switch to Mobile';
    }
    // For mobile, we'll simulate keyboard mode by enabling mouse control
    enableMouseControl();
  } else {
    // Switch to mobile mode on desktop
    if (toggleButton) {
      toggleButton.textContent = 'Switch to Keyboard';
    }
    // For desktop, we'll disable mouse control to simulate mobile mode
    disableMouseControl();
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

  // Handle robot-in-use message
  signalingSocket.on('robot-in-use', function(data) {
    console.log('Robot is currently in use:', data.message);
    updateConnectionStatus('🔴 Robot is currently in use by another user', 'denied');
    updateStatus('Waiting for robot to become available...');

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
      updateConnectionStatus('🟡 Robot available - starting video...', 'pending');
      robotConnected = true;
      isActiveController = true;

      // Create and send WebRTC offer to establish video connection
      createAndSendOffer();

      // Show leave button and update connect button
      const connectButton = document.getElementById('connectButton');
      const leaveButton = document.getElementById('leaveButton');
      if (connectButton) {
        connectButton.textContent = 'Disconnect';
        connectButton.disabled = false;
      }
      if (leaveButton) {
        leaveButton.style.display = 'inline-block';
      }
    }
  });

  signalingSocket.on('robot-unavailable', function() {
    console.log('Robot is unavailable');
    robotConnected = false;
    isActiveController = false;
    updateConnectionStatus('🔴 Robot unavailable', 'denied');

    const connectButton = document.getElementById('connectButton');
    const leaveButton = document.getElementById('leaveButton');
    if (connectButton) {
      connectButton.textContent = 'Connect';
      connectButton.disabled = false;
    }
    if (leaveButton) {
      leaveButton.style.display = 'none';
    }
  });

  // Handle video frames from backend
  signalingSocket.on('video-frame', function(data) {
    if (videoContext && robotConnected && isActiveController && data.frame) {
      try {
        // Convert base64 frame to image and display on canvas
        const img = new Image();
        img.onload = function() {
          try {
            videoContext.drawImage(img, 0, 0, videoCanvas.width, videoCanvas.height);
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
      console.error(`Command error: ${data.error}`);
    } else if (data.status === 'unauthorized') {
      console.error(`Unauthorized: ${data.message}`);
      // If we're not the active controller, update our state
      if (!isActiveController) {
        robotConnected = false;
        updateConnectionStatus('🔴 Not the active controller', 'denied');
      }
    } else if (data.status === 'robot_disconnected') {
      console.log('Robot disconnected');
      robotConnected = false;
      isActiveController = false;
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
    isActiveController = false;
    updateConnectionStatus('🔴 Disconnected', 'denied');

    const connectButton = document.getElementById('connectButton');
    const leaveButton = document.getElementById('leaveButton');
    if (connectButton) {
      connectButton.textContent = 'Connect';
      connectButton.disabled = false;
    }
    if (leaveButton) {
      leaveButton.style.display = 'none';
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
    connectButton.textContent = 'Connect';
    connectButton.disabled = false;
  }
  if (leaveButton) {
    leaveButton.style.display = 'none';
  }

  updateConnectionStatus('🔴 Disconnected', 'denied');
  console.log('Disconnected from robot');
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
  if (signalingSocket && robotConnected && isActiveController) {
    signalingSocket.emit('robot-command', {
      command: command
    });
  }
}

// Mouse tracking for rotation (Minecraft-style)
function enableMouseControl() {
  const isMobile = window.innerWidth <= 1024;
  if (isMobile) return; // Only enable on desktop
  
  isMouseControlEnabled = true;
  const videoContainer = document.getElementById('videoContainer');
  if (videoContainer) {
    videoContainer.classList.add('mouse-control');
  }
  
  // Request pointer lock for mouse control
  if (videoContainer && document.pointerLockElement !== videoContainer) {
    videoContainer.requestPointerLock();
  }
}

function disableMouseControl() {
  isMouseControlEnabled = false;
  const videoContainer = document.getElementById('videoContainer');
  if (videoContainer) {
    videoContainer.classList.remove('mouse-control');
  }
  
  // Exit pointer lock
  if (document.pointerLockElement) {
    document.exitPointerLock();
  }
}

// Mouse movement handler for rotation
function handleMouseMove(event) {
  if (!isMouseControlEnabled || !robotConnected || !isActiveController) return;
  
  const movementX = event.movementX || 0;
  const movementY = event.movementY || 0;
  
  // Send rotation commands based on mouse movement
  if (Math.abs(movementX) > 2) {
    if (movementX > 0) {
      sendRobotCommand('arrowright');
    } else {
      sendRobotCommand('arrowleft');
    }
  }
  
  if (Math.abs(movementY) > 2) {
    if (movementY > 0) {
      sendRobotCommand('arrowdown');
    } else {
      sendRobotCommand('arrowup');
    }
  }
}

// Keyboard event listeners for robot control
document.addEventListener('keydown', function(event) {
  if (!robotConnected || !isActiveController) return;

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
      command = 'jump';
      break;
  }

  if (command) {
    event.preventDefault();
    sendRobotCommand(command);
  }
});

document.addEventListener('keyup', function(event) {
  if (!robotConnected || !isActiveController) return;

  const key = event.key.toLowerCase();
  if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
    sendRobotCommand('n'); // Send neutral command when key is released
  }
});

// Mouse click handler for action
document.addEventListener('click', function(event) {
  if (!robotConnected || !isActiveController) return;
  
  // Only trigger action on left click and if we're in mouse control mode
  if (event.button === 0 && isMouseControlEnabled) {
    sendRobotCommand('action');
  }
});

// Pointer lock event handlers
document.addEventListener('pointerlockchange', function() {
  const videoContainer = document.getElementById('videoContainer');
  if (document.pointerLockElement === videoContainer) {
    // Pointer locked - enable mouse control
    enableMouseControl();
  } else {
    // Pointer unlocked - disable mouse control
    disableMouseControl();
  }
});

// Add mouse movement listener
document.addEventListener('mousemove', handleMouseMove);

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