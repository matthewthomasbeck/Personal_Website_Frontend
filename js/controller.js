// Helper: Parse query string
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const childDiv = document.querySelector('.childDiv');

function runGroupAccessLogic() {
  const idToken = window.sessionStorage.getItem('id_token');
  if (!idToken) {
    // Not logged in, show access denied or login prompt
    childDiv.innerHTML = `
      <div class="statusBox denied">
        ❌ Access Denied – You are not logged in.
      </div>
      <h1>Access Denied</h1>
      <p>
        <a href="#">Click here to log in</a>
      </p>
    `;
    return;
  }
  // Decode JWT and check groups
  const payload = JSON.parse(atob(idToken.split('.')[1]));
  const groups = payload['cognito:groups'] || [];
  if (groups.includes('owner') || groups.includes('privileged')) {
    // Show video feed and controls
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
    // Show access denied
    childDiv.innerHTML = `
      <div class="statusBox denied">
        ❌ Access Denied – You are not in the 'owner' or 'privileged' group.
      </div>
      <h1>Access Denied</h1>
      <p>Please contact the site administrator if you believe this is an error.</p>
    `;
  }
}

// Run immediately if already logged in
if (window.sessionStorage.getItem('id_token')) {
  runGroupAccessLogic();
}
// Also run when tokens become available
window.addEventListener('authTokensAvailable', runGroupAccessLogic);