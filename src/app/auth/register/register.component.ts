import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  NonNullableFormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from 'src/app/core/services/auth.service';
import { InputComponent } from 'src/app/shared/components/input.component';
import { ButtonComponent } from 'src/app/shared/components/button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public registerForm!: FormGroup<{
    name: FormControl<string>;
    phone: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;

  public submitted = false;
  public errorMessage = '';
  public successMessage = '';

  get f() {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name: this.fb.control('', Validators.required),
        phone: this.fb.control('', [Validators.required, Validators.pattern(/^\+380\d{9}$/)]),
        email: this.fb.control('', [Validators.required, Validators.email]),
        password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: this.fb.control('', Validators.required)
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(group: FormGroup): null | object {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onRegister(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) return;

    const { email, password, name, phone } = this.registerForm.getRawValue();
    const role_id = 3; // Seller id
    this.authService.register({ email, password, name, phone, role_id }).subscribe({
      next: () => {
        this.successMessage = 'auth.registerSuccess';
        setTimeout(() => this.router.navigate(['/auth/login']), 3000);
      },
      error: (err) => {
        console.error('❌ Register error:', err);
        this.errorMessage =
          err?.error?.message === 'USER_ALREADY_EXISTS'
            ? 'auth.userAlreadyExists'
            : 'auth.registerFailed';
      }
    });
  }

  ngOnDestroy(): void {
    this.registerForm.reset();
  }
}
