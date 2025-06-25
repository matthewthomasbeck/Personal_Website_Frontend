import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

Amplify.configure({
    Auth: {
        region: 'us-east-2',
        userPoolId: 'us-east-2_f7ZPo0sAY',
        userPoolWebClientId: '5tmo99341gnafobp9h5actl3g2',
        oauth: {
            domain: 'us-east-2f7zpo0say.auth.us-east-2.amazoncognito.com',
            scope: ['email', 'openid', 'profile'],
            redirectSignIn: 'https://www.matthewthomasbeck.com/',
            redirectSignOut: 'https://www.matthewthomasbeck.com/',
            responseType: 'code'
        }
    }
});

(async function enforceAuth() {
    try {
        await getCurrentUser(); // checks identity
        await fetchAuthSession(); // ensures session is active
        console.log('[Controller] User authenticated — loading UI.');

        document.body.innerHTML = `
      <h1>Robot Controller 🦾</h1>
      <p>Use WASD or arrow keys to control the robot.</p>
      <div id="status">Ready</div>
    `;

        // Setup keyboard input listener here later…

    } catch (err) {
        console.warn('[Controller] Not authenticated or session invalid:', err);
        document.body.innerHTML = `
      <h1>Access Denied</h1>
      <p>You must be <a href="/">logged in</a> to access the controller.</p>
    `;
    }
})();