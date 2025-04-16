import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    // Припустимо, що getUserRole() повертає Observable<string> із поточною роллю
    return this.authService.getUserRole().pipe(
      map(role => {
        // Якщо роль ADMIN - дозволяємо доступ
        if (role === 'ADMIN') {
          return true;
        }
        // Якщо роль не ADMIN - повертаємо UrlTree для редіректу на /auth/login
        return this.router.createUrlTree(['/auth/login']);
      }),
      // Якщо при перевірці виникла помилка - редірект на /auth/login
      catchError(err => {
        console.error('AdminGuard error:', err);
        return of(this.router.createUrlTree(['/auth/login']));
      })
    );
  }
}
