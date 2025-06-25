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
        const user = await Amplify.Auth.currentAuthenticatedUser();
        console.log('[Controller] Authenticated user:', user);

        document.body.innerHTML = `
      <h1>Robot Controller</h1>
      <p>Use WASD or arrow keys to drive.</p>
    `;

        // You’ll handle key input and backend logic here next
    } catch (err) {
        console.warn('[Controller] Not logged in:', err);
        window.location.href = '/'; // send them home if unauthorized
    }
})();
