import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmailConfirmationComponent } from './auth/email-confirmation/email-confirmation.component'; // Підключаємо компонент

export const routes: Routes = [
  // 📌 Головний маршрут перенаправляє на авторизацію
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // 🔐 Lazy loading для модуля авторизації
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  // 🔐 Захищений маршрут (Dashboard) з використанням AuthGuard
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard] // Перевіряє, чи користувач авторизований
  },

  // 📌 Маршрут для успішного повідомлення (success-page)
  {
    path: 'success',
    component: EmailConfirmationComponent
  },

  // 🔁 Якщо шлях не знайдено — перенаправляємо на логін
  { path: '**', redirectTo: 'auth/login', pathMatch: 'full' }
];
