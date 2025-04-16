// src/app/core/interceptors/auth.interceptor.ts
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Получаем токен, сохранённый после логина
  const token = authService.getToken();

  // Запросы на авторизацию пропускаем без токена
  const isAuthRequest =
    req.url.includes('/login') ||
    req.url.includes('/refresh-token') ||
    req.url.includes('/reset-password-token');

  // Берём базовый URL из environment
  const apiBase = environment.apiBaseUrl; // e.g. 'http://localhost:8080/api'

  // Проверяем, что запрос идёт к нашему API
  const isApiRequest = req.url.startsWith(apiBase);

  // Если токен есть, это запрос к API и не auth-запрос — добавляем заголовок
  const modifiedReq = token && isApiRequest && !isAuthRequest
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })
    : req;

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.warn('⛔ Ошибка авторизации, редирект на /auth/login:', error.status);
        authService.logout();
        router.navigateByUrl('/auth/login').catch(console.error);
      }
      return throwError(() => error);
    })
  );
};
