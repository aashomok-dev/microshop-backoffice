import { Component, OnInit, OnDestroy } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterModule, NgOptimizedImage],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  public registerForm!: FormGroup;
  public showPassword = false;
  public showConfirmPassword = false;
  public showErrors = false;
  public firstErrorField: string | null = null; // Відображаємо лише одну помилку
  private errorTimeout: any;

  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^\+380\d{9}$/)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get name() {
    return this.registerForm.get('name');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  public shouldShowError(field: string): boolean {
    return this.showErrors && this.firstErrorField === field;
  }

  public shouldShowPasswordMismatchError(): boolean {
    return this.showErrors && this.firstErrorField === 'passwordMismatch';
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private findFirstInvalidField(): string | null {
    for (const field of ['name', 'phone', 'email', 'password', 'confirmPassword']) {
      if (this.registerForm.get(field)?.invalid) return field;
    }
    if (this.registerForm.hasError('passwordMismatch')) return 'passwordMismatch';
    return null;
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  public onRegister(): void {
    this.showErrors = true;
    this.firstErrorField = this.findFirstInvalidField(); // Визначаємо перше поле з помилкою

    clearTimeout(this.errorTimeout);
    this.errorTimeout = setTimeout(() => {
      this.showErrors = false;
      this.firstErrorField = null;
    }, 5000);

    if (this.registerForm.valid) {
      console.log('Дані для реєстрації:', this.registerForm.value);
      alert('Реєстрація успішна! (заглушка)');
    }
  }

  ngOnDestroy(): void {
    this.registerForm.reset();
    clearTimeout(this.errorTimeout);
  }
}
