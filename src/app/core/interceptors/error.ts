import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../http/api-error';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const apiError: ApiError = {
        status: err.status,
        message: err.error?.message ?? err.message,
      };
      return throwError(() => apiError);
    }),
  );
};
