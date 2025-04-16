// src/admin/layout/layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  logout(): void {
    // Тут реалізуємо логіку виходу: видалення токенів, редірект на логін тощо
    console.log('Logout initiated');
  }
}
