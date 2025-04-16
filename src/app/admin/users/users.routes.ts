// src/admin/users/users.routes.ts
import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UserListComponent // Основна сторінка списку користувачів
  },
  {
    path: 'create',
    component: UserFormComponent // Сторінка створення користувача
  },
  {
    path: 'edit/:id',
    component: UserFormComponent // Сторінка редагування користувача (ідентифікатор у маршруті)
  }
];
