import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieStorageService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';

  constructor(private cookieService: CookieService) {}

  // 🔐 Зберігає access token у cookie (на 1 день)
  setAccessToken(token: string): void {
    this.cookieService.set(
      this.ACCESS_TOKEN_KEY,
      token,
      1, // 1 день
      '/',
      '', // домен за замовчуванням
      true, // secure
      'Strict' // sameSite
    );
  }

  // 📥 Отримати access token
  getAccessToken(): string | null {
    return this.cookieService.get(this.ACCESS_TOKEN_KEY) || null;
  }

  // ❌ Видалити access token
  deleteAccessToken(): void {
    this.cookieService.delete(this.ACCESS_TOKEN_KEY, '/');
  }

  // 🔒 Refresh token зберігається браузером (httpOnly), ми до нього не маємо доступу у JS!
}
