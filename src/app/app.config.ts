import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { interceptorProvider } from './interceptors/prod-interceptor'; // <--- OJO CON LA RUTA
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ESTA LÍNEA ES VITAL:
    provideHttpClient(withInterceptorsFromDi()), 
    interceptorProvider, 
    provideAnimationsAsync()
  ]
};