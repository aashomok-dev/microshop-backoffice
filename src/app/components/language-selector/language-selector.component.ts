import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent {
  languages = ['en', 'ua', 'ru'];
  currentLang: string;
  isOpen = false; // ✅ Контроль відображення випадаючого списку

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang || 'ua';
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
    this.isOpen = false; // ✅ Закриваємо випадаючий список після вибору мови
  }
}
