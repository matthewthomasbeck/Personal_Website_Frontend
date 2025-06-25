import { Amplify } from 'https://cdn.skypack.dev/aws-amplify';
import { getCurrentUser, fetchAuthSession } from 'https://cdn.skypack.dev/@aws-amplify/auth';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'us-east-2_f7ZPo0sAY',
            userPoolClientId: '5tmo99341gnafobp9h5actl3g2',
            loginWith: {
                oauth: {
                    domain: 'us-east-2f7zpo0say.auth.us-east-2.amazoncognito.com',
                    scopes: ['email', 'openid', 'profile'],
                    redirectSignIn: ['https://www.matthewthomasbeck.com/'],
                    redirectSignOut: ['https://www.matthewthomasbeck.com/'],
                    responseType: 'code'
                }
            }
        }
    }
});
// This assumes aws-amplify was loaded via <script src="https://unpkg.com/aws-amplify@5.0.4"></script>

(async function enforceAuth() {
    try {
        // Configure Amplify (UMD style)
        window.Amplify.Auth.configure({
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
        });

        const user = await window.Amplify.Auth.currentAuthenticatedUser();
        console.log('[Controller] User authenticated:', user);

        // If you want to enforce group membership later, do it here
        // const groups = user.signInUserSession.accessToken.payload['cognito:groups'] || [];
        // if (!groups.includes('owner') && !groups.includes('privileged')) throw new Error('Unauthorized group');

        document.body.innerHTML = `
            <h1>Robot Controller 🦾</h1>
            <p>Use WASD or arrow keys to control the robot.</p>
            <div id="status">Ready</div>
        `;

    } catch (err) {
        console.warn('[Controller] Not authenticated or session invalid:', err);
        document.body.innerHTML = `
            <h1>Access Denied</h1>
            <p>You must be <a href="/">logged in</a> to access the controller.</p>
        `;
    }
})();
