// src/app/core/models/user.interface.ts

export interface User {
  userId: number;           // Унікальний ідентифікатор користувача
  userEmail: string;        // Email користувача
  phoneNumber: string;      // Номер телефону
  firstName: string;        // Ім'я
  lastName: string;         // Прізвище
  avatarUrl: string;        // URL зображення аватара
  createdAt: string;        // Дата створення (формат ISO, наприклад, "2025-04-15T09:34:17.522Z")
  updatedAt: string;        // Дата останнього оновлення
  deletedAt?: string;       // Дата видалення (необов'язкове поле, може бути null)
  lockedAt?: string;        // Дата блокування (необов'язкове, може бути null)
  lastLoginDate?: string;   // Дата останнього входу (необов'язкове, може бути null)
  userRoleId: number;       // Ідентифікатор ролі користувача (наприклад, ADMIN, USER тощо)
  userDeleted: boolean;     // Флаг, чи було видалення користувача
  locked: boolean;          // Флаг, чи заблокований користувач
}
