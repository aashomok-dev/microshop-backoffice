import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Вказано повний URL з портом

  constructor(private http: HttpClient) {}

  // 🔐 Логін з перевіркою підтвердження email
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      userEmail: data.email,
      password: data.password
    }, this.getJsonHeaders()).pipe(
      tap((response: any) => {
        if (response.emailConfirmed) {
          localStorage.setItem('token', response.token);
        } else {
          throw new Error('EMAIL_NOT_CONFIRMED');
        }
      })
    );
  }

  // 📝 Реєстрація нового користувача
  register(data: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      userEmail: data.email,
      password: data.password,
      firstName: data.name,
      phoneNumber: data.phone,
    }, this.getJsonHeaders());
  }


  // 📩 Підтвердження email
  confirmEmail(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm-email?token=${token}`, {}, this.getJsonHeaders());
  }

  // 🔁 Відновлення пароля (етап 1) - Генерація токена
  forgotPassword(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${this.apiUrl}/reset-password-token`, null, { // POST запит без тіла
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params,
      responseType: 'text' as 'json' // Очікуємо простий текстовий токен від бекенду
    });
  }

  // ✅ Скидання пароля (етап 2)
  resetPassword(token: string, newPassword: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token)
      .set('password', newPassword);

    return this.http.put(`${this.apiUrl}/update-password`, null, { // Виправлено запит на `PUT`
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params
    });
  }

  // 📥 Отримати токен з localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ❌ Вийти з системи
  logout(): void {
    localStorage.removeItem('token');
  }

  // ✅ Перевірка: чи залогінений користувач
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // 🧱 Заголовки
  private getJsonHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }
}
