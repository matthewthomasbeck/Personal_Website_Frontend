// Helper: Parse query string
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const childDiv = document.querySelector('.childDiv');

// Function to check authentication and update UI
function checkAuthenticationAndUpdateUI() {
  const idToken = window.sessionStorage.getItem('id_token');
  
  if (idToken) {
    try {
      // Decode the id_token to get user groups
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      const groups = payload['cognito:groups'] || [];

      if (groups.includes('owner') || groups.includes('privileged')) {
        // Show privileged UI
        childDiv.innerHTML = `
          <div class="statusBox success">
            ✅ Access Granted – You are logged in!
          </div>
          <h1>Robot Controller 🤖</h1>
          <div id="videoStreamPlaceholder">
            <p>[ Video Stream Loading... or Robot is Off ]</p>
          </div>
          <p class="controllerInstructions">Use <strong>WASD</strong> or <strong>Arrow Keys</strong> to control the robot.</p>
          <div id="status">Ready</div>
        `;
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
    } catch (error) {
      console.error('Error decoding token:', error);
      showNotLoggedIn();
    }
  } else {
    showNotLoggedIn();
  }
}

// Function to show not logged in state
function showNotLoggedIn() {
  childDiv.innerHTML = `
    <div class="statusBox denied">
      ❌ Access Denied – You are not logged in.
    </div>
    <h1>Access Denied</h1>
    <p>
      <a href="#">Click here to log in</a>
    </p>
  `;
}

// Use oauthCode from global.js if available, otherwise compute it
var oauthCode = (typeof window.oauthCode !== 'undefined') ? window.oauthCode : getQueryParam('code');

if (oauthCode) {
  // We have an OAuth code, wait for the token exchange to complete
  // Show loading state while we wait
  childDiv.innerHTML = `
    <div class="statusBox loading">
      🔄 Processing login...
    </div>
    <h1>Robot Controller 🤖</h1>
    <p>Please wait while we complete your authentication...</p>
  `;
  
  // Listen for authentication completion event
  window.addEventListener('authenticationComplete', function(event) {
    if (event.detail.success) {
      // Authentication successful, update UI immediately
      checkAuthenticationAndUpdateUI();
    } else {
      // Authentication failed, show error
      childDiv.innerHTML = `
        <div class="statusBox denied">
          ❌ Login failed: ${event.detail.error || 'Unknown error'}
        </div>
        <h1>Access Denied</h1>
        <p>
          <a href="#">Click here to try logging in again</a>
        </p>
      `;
    }
  });
  
  // Fallback: also check after a timeout in case the event doesn't fire
  setTimeout(checkAuthenticationAndUpdateUI, 2000);
} else {
  // No OAuth code, check auth immediately
  checkAuthenticationAndUpdateUI();
}