import { ApplicationConfig, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HttpHeaders } from '@angular/common/http';
import { InMemoryCache } from '@apollo/client/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const platformId = inject(PLATFORM_ID);

      let token = '';

      if (isPlatformBrowser(platformId)) {
        token = localStorage.getItem('token') || '';
      }

      return {
        link: httpLink.create({
          uri: environment.graphqlUrl,
          headers: new HttpHeaders({
            Authorization: token ? `Bearer ${token}` : ''
          })
        }),
        cache: new InMemoryCache()
      };
    })
  ]
};