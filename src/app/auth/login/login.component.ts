import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm!: FormGroup;
  public showPassword: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  public isTouched(field: string): boolean {
    return this.loginForm.get(field)?.dirty || this.loginForm.get(field)?.touched || false;
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.password-container')) {
      this.showPassword = false;
    }
  }

  public onLogin(): void {
    if (this.loginForm.valid) {
      console.log('Авторизація успішна:', this.loginForm.value);
    }
  }

  ngOnDestroy(): void {
    this.loginForm.reset();
  }
}
