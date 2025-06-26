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
                    redirectSignIn: ['https://www.matthewthomasbeck.com/pages/controller.html'],
                    redirectSignOut: ['https://www.matthewthomasbeck.com/pages/controller.html'],
                    responseType: 'code'
                }
            }
        }
    }
});

(async function enforceAuth() {
    try {
        const user = await getCurrentUser(); // Checks identity
        const session = await fetchAuthSession(); // Ensures session is active

        console.log('[Controller] Authenticated user:', user);
        console.log('[Controller] Cognito groups:', session.tokens?.accessToken?.payload["cognito:groups"]);

        const accessToken = session.tokens?.accessToken?.toString();
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const groups = payload["cognito:groups"] || [];

        if (groups.includes("owner") || groups.includes("privileged")) {
            document.body.innerHTML = `
        <h1>Robot Controller 🦾</h1>
        <p>Use WASD or arrow keys to control the robot.</p>
        <div id="status">Ready</div>
      `;
        } else {
            document.body.innerHTML = `
        <h1>Access Denied</h1>
        <p>You are not authorized to access this page.</p>
      `;
        }
    } catch (err) {
        console.warn('[Controller] Not authenticated or session invalid:', err);
        document.body.innerHTML = `
      <h1>Access Denied</h1>
      <p>You must be <a href="/">logged in</a> to access the controller.</p>
    `;
    }
})();
