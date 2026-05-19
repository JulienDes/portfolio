import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (
    req.url.startsWith('/assets') ||
    req.url.startsWith('http://') ||
    req.url.startsWith('https://')
  ) {
    return next(req);
  }

  const token = inject(AuthService).getToken();
  if (!token) return next(req);

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
