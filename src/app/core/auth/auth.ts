import { inject, Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ApiService } from '../http/api';
import { AuthUser, AuthResponse, RegisterDto, ResetPasswordDto } from '../../shared/models/auth';

export const AUTH_TOKEN_KEY = 'app_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly _user = signal<AuthUser | null>(this.loadUser());

  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  /** Authenticates the user and stores the token + profile on success. */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.api
      .post<AuthResponse>('/auth/login', { email, password })
      .pipe(tap((res) => this.handleAuthentication(res)));
  }

  /** Creates a new account and authenticates immediately on success. */
  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.api
      .post<AuthResponse>('/auth/register', dto)
      .pipe(tap((res) => this.handleAuthentication(res)));
  }

  /** Sends a password-reset email to the given address. */
  forgotPassword(email: string): Observable<void> {
    return this.api.post<void>('/auth/forgot-password', { email });
  }

  /** Completes the password-reset flow using the token from the email link. */
  resetPassword(dto: ResetPasswordDto): Observable<void> {
    return this.api.post<void>('/auth/reset-password', dto);
  }

  /** Clears the session — removes token, user, and resets the signal. */
  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem('auth_user');
    this._user.set(null);
  }

  private handleAuthentication(res: AuthResponse): void {
    localStorage.setItem(AUTH_TOKEN_KEY, res.token);
    localStorage.setItem('auth_user', JSON.stringify(res.user));
    this._user.set(res.user);
  }

  private loadUser(): AuthUser | null {
    const raw = localStorage.getItem('auth_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }
}
