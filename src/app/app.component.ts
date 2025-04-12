import { Component, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { HeaderComponent } from './shared/components/header.component'; // ✅ Підключаємо хедер

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent // ✅ Імпортуємо тільки хедер
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public showHeader = true;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      this.showHeader = !url.startsWith('/auth'); // ❌ приховуємо хедер на сторінках /auth
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
