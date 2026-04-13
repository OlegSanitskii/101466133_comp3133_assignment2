import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HttpHeaders } from '@angular/common/http';
import { InMemoryCache } from '@apollo/client/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const token = localStorage.getItem('token') || '';

      return {
        link: httpLink.create({
          uri: 'http://localhost:4000/graphql',
          headers: new HttpHeaders({
            Authorization: token ? `Bearer ${token}` : ''
          })
        }),
        cache: new InMemoryCache()
      };
    })
  ]
};