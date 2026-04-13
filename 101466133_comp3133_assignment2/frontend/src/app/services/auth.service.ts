import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  login(usernameOrEmail: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation LoginUser($input: LoginInput!) {
          login(input: $input) {
            success
            message
            token
            user {
              _id
              username
              email
            }
          }
        }
      `,
      variables: {
        input: {
          usernameOrEmail,
          password
        }
      }
    }).pipe(
      map((result: any) => result.data.login)
    );
  }

  signup(username: string, email: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation SignupUser($input: SignupInput!) {
          signup(input: $input) {
            success
            message
            token
            user {
              _id
              username
              email
            }
          }
        }
      `,
      variables: {
        input: {
          username,
          email,
          password
        }
      }
    }).pipe(
      map((result: any) => result.data.signup)
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}