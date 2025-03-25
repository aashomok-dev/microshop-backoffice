import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
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

  public forgotPasswordForm!: FormGroup;
  public submitted = false;
  public errorMessage = '';
  public emailSent = false;

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  async recoverPassword(): Promise<void> {
    this.submitted = true;
    this.errorMessage = '';
    this.emailSent = false;

    if (this.forgotPasswordForm.invalid) return;

    const email = this.f.email.value;

    try {
      const res = await firstValueFrom(this.authService.forgotPassword(email));
      const token = res?.token;

      if (token) {
        await this.router.navigate(['/reset-password'], {
          queryParams: { token }
        });
      } else {
        this.emailSent = true;
        setTimeout(() => {
          void this.router.navigate(['/auth/login']);
        }, 3000);
      }
    } catch (err: any) {
      console.error('❌ Помилка при запиті на відновлення пароля:', err);
      this.errorMessage =
        err?.error?.message === 'USER_NOT_FOUND_OR_BLOCKED'
          ? 'auth.userNotFoundOrBlocked'
          : 'auth.resetRequestFailed';
    }
  }
}
