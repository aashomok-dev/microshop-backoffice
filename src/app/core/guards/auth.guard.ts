import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/email-confirmation'
  ];

  // ✅ Якщо маршрут публічний — пускаємо навіть неавторизованих
  if (publicRoutes.includes(state.url)) {
    return true;
  }

  // 🔐 Якщо залогінений — пускаємо
  if (isLoggedIn) {
    return true;
  }

  // ❌ Інакше — редірект на логін
  return router.createUrlTree(['/auth/login']);
};
