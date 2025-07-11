import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withDebugTracing } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import ko from '@angular/common/locales/ko';
registerLocaleData(ko);

import { COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';
//import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { CustomHttpInterceptor } from 'src/app/core/interceptor/custom-http-interceptor';
import { ErrorInterceptorService } from 'src/app/core/interceptor/error-interceptor';

import { routes } from './app.routes';

import { ko_KR, provideNzI18n } from 'ng-zorro-antd/i18n';


// https://blog.ninja-squad.com/2022/11/09/angular-http-in-standalone-applications/

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withComponentInputBinding(),
      //withDebugTracing()
    ),
    provideHttpClient(withXsrfConfiguration({cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN'}), withInterceptorsFromDi()),
    //importProvidersFrom(FormsModule),
    { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    { provide: COMPOSITION_BUFFER_MODE, useValue: false},
    //provideAnimations()
    provideAnimationsAsync(),
    provideNzI18n(ko_KR)
  ]
};
