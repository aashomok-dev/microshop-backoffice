import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent], // ✅ Додано LanguageSelectorComponent
  template: `
    <div class="app-root">
      <app-language-selector></app-language-selector>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  constructor() {
    console.log('✅ AppComponent загружен!');
  }
}
