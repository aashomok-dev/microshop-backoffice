import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { EmailConfirmationComponent } from './auth/email-confirmation/email-confirmation.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent }, // ✅ Убедись, что путь правильный
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'email-confirmation', component: EmailConfirmationComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
