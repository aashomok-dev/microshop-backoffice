import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // 🛡️ Пропускаємо запити на login/refresh/token без токена
  const isAuthRequest =
    req.url.includes('/login') ||
    req.url.includes('/refresh-token') ||
    req.url.includes('/reset-password-token');

  // 🔐 Якщо є токен і запит не auth — додаємо заголовок
  const clonedRequest = token && !isAuthRequest
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })
    : req;

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.warn('⛔️ Перенаправлення через помилку авторизації', error.status);
        authService.logout();

        // 🔁 Перенаправлення асинхронно (щоб не блокувало потік)
        router.navigateByUrl('/auth/login').catch(console.error);
      }

      // 🔄 Проброс помилки далі
      return throwError(() => error);
    })
  );
};
