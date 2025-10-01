export const environment = {
    production: false,
    keycloak: {
        config: {
            url: 'http://auth.localhost',
            realm: 'freeboard',
            clientId: 'freeboard-frontend',
        },
        initOptions: {
            onLoad: 'login-required',
            checkLoginIframe: false
        }
    }
};