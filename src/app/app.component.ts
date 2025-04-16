// src/app/app.component.ts
import { Component, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { HeaderComponent } from './shared/components/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent // Використовуємо глобальний Header для публічних сторінок (якщо потрібно)
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Показувати глобальний Header лише на публічних сторінках, не на /auth та /dashboard
  public showHeader = true;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      // Приховуємо Header, якщо маршрут починається з '/auth' або '/dashboard'
      this.showHeader = !(url.startsWith('/auth') || url.startsWith('/dashboard'));
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
