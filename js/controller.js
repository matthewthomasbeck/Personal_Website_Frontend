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
        const childDiv = document.querySelector('.childDiv');

        if (groups.includes("owner") || groups.includes("privileged")) {
            childDiv.innerHTML = `
            <div class="statusBox success">
              ✅ Access Granted – You are logged in as <strong>${user.username}</strong>
            </div>
            <h1>Robot Controller 🦾</h1>
            <div id="videoStreamPlaceholder">
              <p>[ Video Stream Loading... or Robot is Off ]</p>
            </div>
            <p class="controllerInstructions">Use <strong>WASD</strong> or <strong>Arrow Keys</strong> to control the robot.</p>
            <div id="status">Ready</div>
          `;
        } else {
            childDiv.innerHTMLL = `
            <div class="statusBox denied">
              ❌ Access Denied – You are not in the 'owner' or 'privileged' group.
            </div>
            <h1>Access Denied</h1>
            <p>Please contact the site administrator if you believe this is an error.</p>
          `;
        }
    } catch (err) {
        console.warn('[Controller] Not authenticated or session invalid:', err);
        childDiv.innerHTML = `
          <div class="statusBox denied">
            ❌ Access Denied – You are not logged in.
          </div>
          <h1>Access Denied</h1>
          <p>You must be <a href="https://us-east-2f7zpo0say.auth.us-east-2.amazoncognito.com/login?client_id=5tmo99341gnafobp9h5actl3g2&redirect_uri=https%3A%2F%2Fwww.matthewthomasbeck.com%2Fpages%2Fcontroller.html&response_type=code&scope=email+openid+profile">logged in</a> to access the controller.</p>
        `;
    }
})();
