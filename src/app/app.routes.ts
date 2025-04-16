// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { EmailConfirmationComponent } from './auth/email-confirmation/email-confirmation.component';

export const routes: Routes = [
  // Основний маршрут перенаправляє на логін
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // Lazy loading для модуля авторизації
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  // Lazy loading для адмін-панелі, захищена AuthGuard
  {
    path: 'dashboard',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [AuthGuard]
  },

  // Маршрут для сторінки підтвердження email (success-page)
  {
    path: 'success',
    component: EmailConfirmationComponent
  },

  // Якщо шлях не знайдено — перенаправляємо на логін
  { path: '**', redirectTo: 'auth/login', pathMatch: 'full' }
];
