// src/app/core/services/role.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  // Базовий URL для API; переконайтеся, що environment.apiBaseUrl налаштовано правильно
  private baseUrl = environment.apiBaseUrl || 'http://user-service/api';

  constructor(private http: HttpClient) {}

  /**
   * Отримує список ролей.
   * GET /api/roles
   */
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/roles`);
  }

  /**
   * Отримує роль за її ідентифікатором.
   * GET /api/roles/{id}
   */
  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.baseUrl}/roles/${id}`);
  }

  /**
   * Створює нову роль.
   * POST /api/roles
   */
  createRole(payload: Partial<Role>): Observable<Role> {
    return this.http.post<Role>(`${this.baseUrl}/roles`, payload);
  }

  /**
   * Оновлює існуючу роль.
   * PUT /api/roles/{id}
   */
  updateRole(id: number, payload: Partial<Role>): Observable<Role> {
    return this.http.put<Role>(`${this.baseUrl}/roles/${id}`, payload);
  }

  /**
   * Видаляє роль за її ідентифікатором.
   * DELETE /api/roles/{id}
   */
  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/roles/${id}`);
  }
}
