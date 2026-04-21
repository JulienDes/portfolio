import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { APP_CONFIG } from './core/http/app-config';
import { authInterceptor } from './core/interceptors/auth';
import { errorInterceptor } from './core/interceptors/error';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
    { provide: APP_CONFIG, useValue: { apiBaseUrl: environment.apiBaseUrl } },
  ],
};
