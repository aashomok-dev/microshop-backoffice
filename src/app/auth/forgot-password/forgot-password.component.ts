import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { InputComponent } from 'src/app/shared/components/input.component';
import { ButtonComponent } from 'src/app/shared/components/button.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public forgotPasswordForm!: FormGroup<{
    email: FormControl<string>;
  }>;

  public submitted = false;
  public errorMessage = '';
  public emailSent = false;
  public successMessage = '';
  public resetToken: string | null = null;
  public email: string = '';

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email])
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  async recoverPassword(): Promise<void> {
    this.submitted = true;
    this.errorMessage = '';
    this.emailSent = false;
    this.successMessage = '';

    if (this.forgotPasswordForm.invalid) return;

    this.email = this.f.email.value;

    try {
      const response = await firstValueFrom(
        this.authService.forgotPassword(this.email) // 🧠 вже передає у body
      );

      if (response?.token) {
        sessionStorage.setItem('resetPasswordToken', response.token);
        this.resetToken = response.token;
        this.emailSent = true;
        this.successMessage = 'auth.emailSentSuccess';
      } else {
        this.errorMessage = 'auth.resetRequestFailed';
      }

    } catch (err: any) {
      console.error('❌ Запит скидання пароля:', err);

      this.errorMessage =
        err?.error?.message === 'USER_NOT_FOUND_OR_BLOCKED'
          ? 'auth.userNotFoundOrBlocked'
          : 'auth.resetRequestFailed';
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goToMailbox(): void {
    const domain = this.email.split('@')[1];
    const emailDomains: Record<string, string> = {
      'gmail.com': 'https://mail.google.com',
      'ukr.net': 'https://mail.ukr.net',
      'outlook.com': 'https://outlook.live.com',
      'i.ua': 'https://mail.i.ua',
      'meta.ua': 'https://mail.meta.ua',
      'yahoo.com': 'https://mail.yahoo.com'
    };

    const url = emailDomains[domain];
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('⚠️ Невідомий поштовий сервіс: ' + domain);
    }
  }
}
