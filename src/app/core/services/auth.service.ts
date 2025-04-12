import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { CookieStorageService } from './cookie.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    private cookieStorage: CookieStorageService
  ) {}

  // 🔐 Логін
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<{ accessToken: string }>(
      `${this.apiUrl}/login`,
      {
        userEmail: data.email,
        password: data.password
      },
      { observe: 'response', withCredentials: true }
    ).pipe(
      tap((res) => {
        const accessToken = res.body?.accessToken;
        if (accessToken) {
          this.cookieStorage.setAccessToken(accessToken);
        }
      }),
      map(res => res.body)
    );
  }

  // 📝 Реєстрація
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
    return this.http.get(`${this.apiUrl}/confirm-email?token=${token}`, this.getJsonHeaders());
  }

  // 📥 Відновлення пароля — отримання токена
  forgotPassword(email: string): Observable<{ token: string }> {
    return this.http.post(
      `${this.apiUrl}/reset-password-token`,
      { email },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'text' as 'json'
      }
    ).pipe(map((token: string) => ({ token })));
  }

  // 🔁 Скидання пароля — надсилання нового пароля
  resetPassword(token: string, newPassword: string): Observable<{ userEmail: string }> {
    return this.http.put<{ userEmail: string }>(
      `${this.apiUrl}/update-password`,
      { token, password: newPassword },
      this.getJsonHeaders()
    );
  }

  // 🔄 Оновлення access token
  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh-token`, {
      refreshToken
    }, this.getJsonHeaders()).pipe(
      tap((response: any) => {
        if (response?.accessToken) {
          this.cookieStorage.setAccessToken(response.accessToken);
        }
      })
    );
  }

  // 🔒 Зміна пароля
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword
    }, this.getJsonHeaders());
  }

  // 🧾 Отримання ролей
  verifyAndGetRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify-and-get-roles`, this.getJsonHeaders());
  }

  // 📥 Отримати access token з cookie
  getToken(): string | null {
    return this.cookieStorage.getAccessToken();
  }

  // ❌ Вийти з системи
  logout(): void {
    this.cookieStorage.deleteAccessToken();
  }

  // ✅ Перевірка статусу
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // 🔧 Заголовки
  private getJsonHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };
  }
}
