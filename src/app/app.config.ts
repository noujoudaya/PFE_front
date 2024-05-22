import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';

import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi} from "@angular/common/http";
import {HttpTokenInterceptor} from "./services/interceptor/http-token.interceptor";

import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';

import {
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    importProvidersFrom(SidebarModule, DropdownModule),
    IconSetService,
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide:HTTP_INTERCEPTORS,
      useClass:HttpTokenInterceptor,
      multi:true
    },
    provideCharts(withDefaultRegisterables()),
    FullCalendarModule
  ]
};
