import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Standalone компоненти
import { InputComponent } from './components/input.component';
import { ButtonComponent } from './components/button.component';
import { LoaderComponent } from './components/loader.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,

    // Standalone компоненти, які мають бути доступні в інших модулях
    InputComponent,
    ButtonComponent,
    LoaderComponent
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,

    // Компоненти для повторного використання
    InputComponent,
    ButtonComponent,
    LoaderComponent
  ]
})
export class SharedModule {}
