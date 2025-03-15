import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [CommonModule, TranslateModule], // ✅ Добавили TranslateModule
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent {
  confirmEmail(): void {
    console.log('Email подтвержден!');
    alert('Ваш email успешно подтверждён! (заглушка)');
  }
}
