// Helper: Parse query string
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const childDiv = document.querySelector('.childDiv');
const code = getQueryParam('code');

if (code) {
  // Step 2: Exchange code for tokens via your backend
  fetch('http://18.188.23.76:3001/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: code,
      redirectUri: window.location.origin + window.location.pathname
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.access_token) {
      // Store tokens in sessionStorage
      window.sessionStorage.setItem('access_token', data.access_token);
      window.sessionStorage.setItem('id_token', data.id_token);
      window.sessionStorage.setItem('refresh_token', data.refresh_token);
      // Remove code from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Show authenticated UI
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
      childDiv.innerHTML = `
        <div class="statusBox denied">
          ❌ Access Denied – Login failed.
        </div>
        <h1>Access Denied</h1>
        <p>${data.error?.error || 'Unknown error'}</p>
      `;
    }
  });
} else {
  // Not logged in, show login link
  const cognitoDomain = 'https://us-east-2f7zpo0say.auth.us-east-2.amazoncognito.com'; // Replace with your domain
  const clientId = '74g6ttg50amd7uqcecbngv64mh'; // Replace with your client ID
  const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname);
  childDiv.innerHTML = `
    <div class="statusBox denied">
      ❌ Access Denied – You are not logged in.
    </div>
    <h1>Access Denied</h1>
    <p>
      <a href="${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${redirectUri}">
        Click here to log in
      </a>
    </p>
  `;
}