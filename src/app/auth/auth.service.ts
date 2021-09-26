import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

interface UserData {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  private static readonly url: string =
    'https://identitytoolkit.googleapis.com/v1/accounts:';

  private static readonly key: string = environment.fireBaseKey;

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${AuthService.url}signUp?key=${AuthService.key}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((response: AuthResponseData) => {
          this.handleAuthentication(
            response.email,
            response.localId,
            response.idToken,
            Number(response.expiresIn)
          );
        })
      );
  }

  signIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `${AuthService.url}signInWithPassword?key=${AuthService.key}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((response: AuthResponseData) => {
          this.handleAuthentication(
            response.email,
            response.localId,
            response.idToken,
            Number(response.expiresIn)
          );
        })
      );
  }

  autoLogin() {
    const userDataStringify: string = localStorage.getItem('userData') || '';

    const userData: UserData | null = userDataStringify
      ? JSON.parse(userDataStringify)
      : null;
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();

      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const exiprationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, exiprationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string = 'An unknown error occured.';

    if (errorRes?.error?.error?.message) {
      const error = errorRes.error.error.message.trim();
      switch (error) {
        case error.match(/EMAIL_EXISTS/)?.input:
          errorMessage = 'Email already Exists.';
          break;

        case error.match(/OPERATION_NOT_ALLOWED/)?.input:
          errorMessage = 'Email is not allowed.';
          break;

        case error.match(/TOO_MANY_ATTEMPTS_TRY_LATER/)?.input:
          errorMessage = 'Too many attempts, Try again later.';
          break;

        case error.match(/EMAIL_NOT_FOUND/)?.input:
          errorMessage = 'Email is invalid.';
          break;

        case error.match(/INVALID_PASSWORD/)?.input:
          errorMessage = 'Password is invalid.';
          break;

        case error.match(/USER_DISABLED/)?.input:
          errorMessage =
            'The user account has been disabled by an administrator.';
          break;

        default:
          break;
      }
    }
    return throwError(errorMessage);
  }
}
