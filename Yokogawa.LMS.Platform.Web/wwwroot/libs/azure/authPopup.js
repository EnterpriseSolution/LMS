function initAzureAuthPopup(msalConfig) {
    // Create the main myMSALObj instance
    // configuration parameters are located at authConfig.js
    const myMSALObj = new msal.PublicClientApplication(msalConfig);

    const loginRequest = {
        scopes: ["openid", "profile"]
    };

    const silentRequest = {
        scopes: ["openid", "profile"],
        loginHint: "example@domain.net"
    };

    const tokenRequest = {
        scopes: ["openid", "profile"],
        forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
    };

    let username = "";
    let authenticationHanlder = {};
    function selectAccount() {

        /**
         * See here for more info on account retrieval: 
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
         */

        const currentAccounts = myMSALObj.getAllAccounts();

        if (!currentAccounts || currentAccounts.length < 1) {
            return;
        } else if (currentAccounts.length > 1) {
            // Add your account choosing logic here
            console.warn("Multiple accounts detected.");
        } else if (currentAccounts.length === 1) {
            username = currentAccounts[0].username;
            welcomeUser(username);
            updateTable();
        }
    }

    function handleResponse(response) {

        /**
         * To see the full list of response object properties, visit:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
         */

        if (response !== null) {
            username = response.account.username;
            if (authenticationHanlder.successCallback != null)
                authenticationHanlder.successCallback(response);
        } else {

            selectAccount();

            /**
             * If you already have a session that exists with the authentication server, you can use the ssoSilent() API
             * to make request for tokens without interaction, by providing a "login_hint" property. To try this, comment the 
             * line above and uncomment the section below.
             */

             myMSALObj.ssoSilent(silentRequest).
                 then(() => {
                     const currentAccounts = myMSALObj.getAllAccounts();
                    username = currentAccounts[0].username;
                     getToken(tokenRequest);
                 }).catch(error => {
                     console.error("Silent Error: " + error);
                     if (error instanceof msal.InteractionRequiredAuthError) {
                         signIn();
                    }
                 });
        }
    }

    function signIn() {

        /**
         * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
         */

        myMSALObj.loginPopup(loginRequest)
            .then(handleResponse)
            .catch(error => {
                console.error(error);
            });
    }

    function signOut() {

        /**
         * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
         */

        // Choose which account to logout from by passing a username. has error
        /*const logoutRequest = {
            account: myMSALObj.getAccountByUsername(username)
        };
        
        myMSALObj.logout(logoutRequest);*/
        myMSALObj.logout();
    }

    function getToken(request) {
        request.account = myMSALObj.getAccountByUsername(username);
        return myMSALObj.acquireTokenSilent(request).then(tokenResponse => {
            console.log(tokenResponse);
            //do something
            if (authenticationHanlder.successCallback != null)
                authenticationHanlder.successCallback(tokenResponse);
            return tokenResponse;
        }).catch(error => {
            console.warn("silent token acquisition fails. acquiring token using redirect");
            if (error instanceof msal.InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                return myMSALObj.acquireTokenPopup(request).then(tokenResponse => {
                    console.log(tokenResponse);
                    if (authenticationHanlder.successCallback != null)
                        authenticationHanlder.successCallback(tokenResponse);
                    return tokenResponse;
                }).catch(error => {
                    console.error(error);
                    //do something
                    if (authenticationHanlder.failureCallback != null)
                        authenticationHanlder.failureCallback()
                });
            } else {
                console.warn(error);
                //do something
                if (authenticationHanlder.failureCallback != null)
                    authenticationHanlder.failureCallback()
            }
        });
    }

    return {
        signIn: signIn,
        signOut: signOut,
        setAuthenticateSuccessHandler: function (handler) {
            if (handler != null)
                authenticationHanlder.successCallback = handler;
        },
        setAuthenticateFailureHandler: function (handler) {
            if (handler != null)
                authenticationHanlder.failureCallback = handler;
        }
    }
}
