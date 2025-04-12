import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  NonNullableFormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { catchError, of } from 'rxjs';
import { InputComponent } from 'src/app/shared/components/input.component';
import { ButtonComponent } from 'src/app/shared/components/button.component';
import { LanguageSelectorComponent } from 'src/app/components/language-selector/language-selector.component'; // 🆕

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    NgOptimizedImage,
    InputComponent,
    ButtonComponent,
    LanguageSelectorComponent // 🆕 додано сюди
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public loginForm!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  public submitted = false;
  public showPassword = false;
  public errorMessage = '';
  private errorTimeout: any;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', Validators.required)
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    this.submitted = true;
    clearTimeout(this.errorTimeout);
    this.errorMessage = '';

    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.getRawValue();

    this.authService
      .login({ email, password })
      .pipe(
        catchError(err => {
          console.error('❌ Login error:', err);
          this.errorMessage =
            err?.message === 'EMAIL_NOT_CONFIRMED'
              ? 'auth.emailNotConfirmed'
              : 'auth.loginFailed';
          return of(null);
        })
      )
      .subscribe(res => {
        if (res) void this.router.navigate(['/dashboard']);
      });

    this.errorTimeout = setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  ngOnDestroy(): void {
    this.loginForm.reset();
    clearTimeout(this.errorTimeout);
  }
}
