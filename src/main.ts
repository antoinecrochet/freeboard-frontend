import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import {
  AutoRefreshTokenService,
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  provideKeycloak,
  UserActivityService,
  withAutoRefreshToken,
  includeBearerTokenInterceptor
} from 'keycloak-angular';
import { environment } from './environments';
import { KeycloakOnLoad } from 'keycloak-js';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';

const localhostCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(http:\/\/localhost:8080)(\/.*)?$/i
});

const initializeApp = async () => {
  const appConfig: ApplicationConfig = {
    providers: [
      provideKeycloak({
        config: {
          url: environment.keycloak.config.url,
          realm: environment.keycloak.config.realm,
          clientId: environment.keycloak.config.clientId
        },
        initOptions: {
          onLoad: environment.keycloak.initOptions.onLoad as KeycloakOnLoad,
          checkLoginIframe: environment.keycloak.initOptions.checkLoginIframe
        },
        features: [
          withAutoRefreshToken({
            onInactivityTimeout: 'logout',
            sessionTimeout: 60000
          })
        ],
        providers: [
          AutoRefreshTokenService,
          UserActivityService,
          {
            provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
            useValue: [localhostCondition]
          }
        ]
      }),
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideAnimations(),              // ✅ animations support
      provideNativeDateAdapter(),       // ✅ date adapter for Material
      provideHttpClient(withInterceptors([includeBearerTokenInterceptor]))
    ]
  };

  await bootstrapApplication(App, appConfig);
};

initializeApp().catch((error) =>
  console.error(`Failed to initialize the application. ${error.message || error}`)
);



// bootstrapApplication(App, {
//   providers: [
//     provideHttpClient(),
//     provideRouter(routes),
//     provideKeycloak({
//       config: {
//         url: environment.keycloak.config.url,
//         realm: environment.keycloak.config.realm,
//         clientId: environment.keycloak.config.clientId
//       },
//       initOptions: {
//         onLoad: environment.keycloak.initOptions.onLoad as KeycloakOnLoad,
//         checkLoginIframe: environment.keycloak.initOptions.checkLoginIframe
//       },
//       features: [
//         withAutoRefreshToken({
//           onInactivityTimeout: 'logout',
//           sessionTimeout: 60000
//         })
//       ],
//       providers: [
//         AutoRefreshTokenService,
//         UserActivityService,
//         {
//           provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
//           useValue: [localhostCondition]
//         }
//       ]
//     }),
//   ],
// }).catch((err) => console.error(err));