// src/app/admin/users/user-list/user-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user.interface';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);

  public users: User[] = [];
  public loading: boolean = false;
  public errorMessage: string = '';

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Помилка при отриманні користувачів:', error);
        this.errorMessage = 'Помилка завантаження даних користувачів';
        this.loading = false;
      }
    });
  }

  onDeleteUser(userId: number): void {
    if (confirm('Ви впевнені, що хочете видалити цього користувача?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.userId !== userId);
        },
        error: (error) => {
          console.error('Помилка при видаленні користувача:', error);
          this.errorMessage = 'Помилка видалення користувача';
        }
      });
    }
  }
}
