import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup; // ✅ Исправлено: добавлено свойство `registerForm`

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]], // ✅ Поле имя
      email: ['', [Validators.required, Validators.email]], // ✅ Поле email
      password: ['', [Validators.required, Validators.minLength(6)]], // ✅ Поле password
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]] // ✅ Подтверждение пароля
    });
  }

  get name() {
    return this.registerForm.get('name');
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

  isTouched(field: string): boolean {
    return this.registerForm.get(field)?.dirty || this.registerForm.get(field)?.touched || false;
  }

  onRegister(): void { // ✅ Исправлено: добавлен метод `onRegister()`
    if (this.registerForm.valid) {
      console.log('Дані для реєстрації:', this.registerForm.value);
      alert('Реєстрація успішна! (заглушка)');
    }
  }
}
