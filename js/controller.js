import { Amplify } from 'aws-amplify';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

Amplify.configure({
    Auth: {
        region: 'us-east-2',
        userPoolId: 'us-east-2_f7ZPo0sAY',
        userPoolWebClientId: '5tmo99341gnafobp9h5actl3g2',
        oauth: {
            domain: 'us-east-2f7zpo0say.auth.us-east-2.amazoncognito.com',
            scope: ['email', 'openid', 'profile'],
            redirectSignIn: 'https://www.matthewthomasbeck.com/pages/logging_in.html',
            redirectSignOut: 'https://www.matthewthomasbeck.com/',
            responseType: 'code'
        }
    }
});

(async function enforceAuth() {
    try {
        const user = await getCurrentUser();
        const session = await fetchAuthSession();

        const idToken = session.tokens.idToken.toString();
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        const groups = payload['cognito:groups'] || [];

        console.log('[Controller] Authenticated user:', user.username);
        console.log('[Controller] Cognito groups:', groups);

        if (!groups.includes('owner') && !groups.includes('privileged')) {
            throw new Error('Access denied: user not in authorized groups');
        }

        console.log('[Controller] Access granted — loading UI');

        document.body.innerHTML = `
            <h1>Robot Controller 🦾</h1>
            <p>Use WASD or arrow keys to control the robot.</p>
            <div id="status">Ready</div>
        `;

        // TODO: Add keyboard input handler here later

    } catch (err) {
        console.warn('[Controller] Authentication failed or user not authorized:', err);
        document.body.innerHTML = `
            <h1>Access Denied</h1>
            <p>You must be <a href="/">logged in</a> and authorized to use the controller.</p>
        `;
    }
})();
