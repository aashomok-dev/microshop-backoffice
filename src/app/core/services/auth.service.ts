import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth'; // без localhost:8082

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
  register(data: { email: string; password: string; name?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      userEmail: data.email,
      password: data.password,
      name: data.name
    }, this.getJsonHeaders());
  }

  // 📩 Підтвердження email
  confirmEmail(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm-email?token=${token}`, {}, this.getJsonHeaders());
  }

  // 🔁 Відновлення пароля (етап 1) — запит на reset-password-token
// 🔁 Відновлення пароля (етап 1)
  forgotPassword(email: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/reset-password-token?email=${encodeURIComponent(email)}`,
      {},
      this.getJsonHeaders()
    );
  }



  // ✅ Скидання пароля (етап 2)
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password?token=${token}`, {
      newPassword
    }, this.getJsonHeaders());
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
