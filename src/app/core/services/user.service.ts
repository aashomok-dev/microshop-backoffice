// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Берём URL из environment
  private baseUrl = environment.apiBaseUrl; // e.g. 'http://localhost:8080/api'

  constructor(private http: HttpClient) {}

  /**
   * GET /api/users
   * Отримує список користувачів і перетворює snake_case → camelCase
   */
  getUsers(): Observable<User[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`).pipe(
      map(items => items.map(item => this.transformToUser(item)))
    );
  }

  /**
   * GET /api/users/{id}
   */
  getUserById(userId: number): Observable<User> {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}`).pipe(
      map(item => this.transformToUser(item))
    );
  }

  /**
   * POST /api/users
   */
  createUser(payload: Partial<User>): Observable<User> {
    const body = this.transformFromUser(payload);
    return this.http.post<any>(`${this.baseUrl}/users`, body).pipe(
      map(item => this.transformToUser(item))
    );
  }

  /**
   * PUT /api/users/{id}
   */
  updateUser(userId: number, payload: Partial<User>): Observable<User> {
    const body = this.transformFromUser(payload);
    return this.http.put<any>(`${this.baseUrl}/users/${userId}`, body).pipe(
      map(item => this.transformToUser(item))
    );
  }

  /**
   * DELETE /api/users/{id}
   */
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }

  /**
   * Snake → camel
   */
  private transformToUser(item: any): User {
    return {
      userId: item.user_id ?? item.userId,
      userEmail: item.user_email ?? item.userEmail,
      phoneNumber: item.phone_number ?? item.phoneNumber,
      firstName: item.first_name ?? item.firstName,
      lastName: item.last_name ?? item.lastName,
      avatarUrl: item.avatar_url ?? item.avatarUrl,
      createdAt: item.created_at ?? item.createdAt,
      updatedAt: item.updated_at ?? item.updatedAt,
      deletedAt: item.deleted_at ?? item.deletedAt,
      lockedAt: item.locked_at ?? item.lockedAt,
      lastLoginDate: item.last_login_date ?? item.lastLoginDate,
      userRoleId: item.user_role_id ?? item.userRoleId,
      userDeleted: item.user_deleted ?? item.userDeleted,
      locked: item.locked
    };
  }

  /**
   * Camel → snake (для POST/PUT)
   */
  private transformFromUser(payload: Partial<User>): any {
    const body: any = {};
    if (payload.userEmail     !== undefined) body.user_email     = payload.userEmail;
    if (payload.phoneNumber   !== undefined) body.phone_number   = payload.phoneNumber;
    if (payload.firstName     !== undefined) body.first_name     = payload.firstName;
    if (payload.lastName      !== undefined) body.last_name      = payload.lastName;
    if (payload.avatarUrl     !== undefined) body.avatar_url     = payload.avatarUrl;
    if (payload.userRoleId    !== undefined) body.user_role_id   = payload.userRoleId;
    // додайте інші поля за потребою
    return body;
  }
}
