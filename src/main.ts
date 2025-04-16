// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';

// i18n та переклади через ngx-translate
import {
  TranslateLoader,
  TranslateService,
  TranslateStore,
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateParser,
  TranslateDefaultParser,
  TranslateFakeCompiler,
  USE_DEFAULT_LANG,
  ISOLATE_TRANSLATE_SERVICE,
  USE_EXTEND,
  DEFAULT_LANGUAGE,
} from '@ngx-translate/core';

import { HttpLoaderFactory } from './providers/translate-loader';
import { CustomMissingTranslationHandler } from './providers/custom-missing-translation-handler';

// Глобальні маршрути додатку (lazy loading для auth та admin секцій)
import { routes } from './app/app.routes';

// CoreModule — включає guards, інтерсептори, сервіси та інші "ядрові" елементи застосунку
import { CoreModule } from './app/core/core.module';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),

    // Конфігурація ngx-translate для i18n
    {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    },
    TranslateService,
    TranslateStore,
    { provide: TranslateCompiler, useClass: TranslateFakeCompiler },
    { provide: TranslateParser, useClass: TranslateDefaultParser },
    { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler },
    { provide: USE_DEFAULT_LANG, useValue: 'ua' },
    { provide: DEFAULT_LANGUAGE, useExisting: USE_DEFAULT_LANG },
    { provide: ISOLATE_TRANSLATE_SERVICE, useValue: false },
    { provide: USE_EXTEND, useValue: true },

    // Підключаємо CoreModule для роботи з guards, інтерсепторами, сервісами
    importProvidersFrom(CoreModule)
  ]
})
  .catch(err => console.error(err));
