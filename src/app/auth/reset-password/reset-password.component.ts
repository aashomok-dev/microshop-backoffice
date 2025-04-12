import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  Validators,
  NonNullableFormBuilder,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { InputComponent } from 'src/app/shared/components/input.component';
import { ButtonComponent } from 'src/app/shared/components/button.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public resetPasswordForm!: FormGroup<{
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;

  public submitted = false;
  public errorMessage = '';
  public successMessage = '';
  public successEmail = '';
  public token = '';
  public loading = false;
  public validToken = true;

  private timeoutRef: any;

  get f() {
    return this.resetPasswordForm.controls;
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      newPassword: this.fb.control('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: this.fb.control('', [Validators.required, Validators.minLength(6)])
    });

    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    const savedToken = sessionStorage.getItem('resetPasswordToken');

    if (!this.token || !savedToken || this.token !== savedToken) {
      this.validToken = false;
      this.errorMessage = 'auth.invalidResetToken';

      this.timeoutRef = setTimeout(() => {
        this.router.navigate(['/auth/forgot-password']);
      }, 10000);
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutRef) clearTimeout(this.timeoutRef);
  }

  async resetPassword(): Promise<void> {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.successEmail = '';

    if (this.resetPasswordForm.invalid) return;

    const { newPassword, confirmPassword } = this.resetPasswordForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'auth.passwordsDoNotMatch';
      return;
    }

    this.loading = true;

    try {
      const response = await firstValueFrom(
        this.authService.resetPassword(this.token, newPassword)
      );

      sessionStorage.removeItem('resetPasswordToken');

      this.successEmail = response?.userEmail || '';
      this.successMessage = 'auth.resetSuccessWithEmail';
      this.loading = false;

    } catch (err: any) {
      console.error('❌ Reset error:', err);

      this.errorMessage =
        err?.error?.message === 'INVALID_OR_EXPIRED_TOKEN'
          ? 'auth.invalidResetToken'
          : 'auth.resetFailed';

      this.loading = false;
    }
  }

  // 🧭 Повернення до логіну вручну
  public goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
