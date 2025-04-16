// src/app/admin/users/user-form/user-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user.interface';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  // Інжектуємо необхідні сервіси (вони використовуються тільки в TS, тому можуть бути приватними)
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Властивості, до яких звертаються в HTML, оголошуємо як public
  public userForm = this.fb.group({
    userEmail: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: ['', Validators.required]
  });

  public isEditMode = false;
  public userId: number | null = null;
  public loading = false;
  public errorMessage = '';

  public ngOnInit(): void {
    // Перевіряємо параметри маршруту: якщо є "id" — режим редагування
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.userId = parseInt(idParam, 10);
        this.loadUserData(this.userId);
      }
    });
  }

  // Метод завантаження даних користувача для редагування (використовується тільки з TS)
  private loadUserData(id: number): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (user: User) => {
        this.userForm.patchValue({
          userEmail: user.userEmail,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber
        });
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Сталася помилка при завантаженні даних користувача.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // Публічний хелпер для перевірки валідності та touched поля форми
  public isInvalidAndTouched(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  // Метод, який викликається з шаблону при відправці форми
  public onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }
    this.loading = true;
    const formData = this.userForm.value;

    if (this.isEditMode && this.userId) {
      // Режим редагування
      this.userService.updateUser(this.userId, formData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard/users']);
        },
        error: (err) => {
          this.errorMessage = 'Сталася помилка при оновленні даних користувача.';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      // Режим створення нового користувача
      this.userService.createUser(formData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard/users']);
        },
        error: (err) => {
          this.errorMessage = 'Сталася помилка при створенні користувача.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}
