import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common'; // Додано NgOptimizedImage
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterModule, NgOptimizedImage], // Додано NgOptimizedImage
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm!: FormGroup;
  public showPassword = false;
  public showErrors = false; // Флаг для показу помилок

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public shouldShowEmailError(): boolean {
    return this.showErrors && this.email?.invalid;
  }

  public shouldShowPasswordError(): boolean {
    return this.showErrors && this.email?.valid && this.password?.invalid;
  }

  public onLogin(): void {
    this.showErrors = true; // Включаємо показ помилок після натискання кнопки

    if (this.loginForm.valid) {
      console.log('Авторизація успішна:', this.loginForm.value);
    }
  }

  ngOnDestroy(): void {
    this.loginForm.reset();
  }
}
