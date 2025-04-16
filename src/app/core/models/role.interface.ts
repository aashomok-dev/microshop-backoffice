// src/app/core/models/role.interface.ts

export interface Role {
  roleId: number;         // Унікальний ідентифікатор ролі
  roleName: string;       // Назва ролі (наприклад, ADMIN, USER тощо)
  description?: string;   // Опис ролі (необов'язкове поле)
}
