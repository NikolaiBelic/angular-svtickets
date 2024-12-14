import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './shared/interceptors/base-url.interceptor';
import { authInterceptor } from './shared/interceptors/auth.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(), 
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)), 
    provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor]))
  ]
};
//provideZoneChangeDetection({ eventCoalescing: true })
