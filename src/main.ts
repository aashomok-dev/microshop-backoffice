import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

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
  DEFAULT_LANGUAGE
} from '@ngx-translate/core';

import { HttpLoaderFactory } from './providers/translate-loader';
import { CustomMissingTranslationHandler } from './providers/custom-missing-translation-handler';
import { routes } from './app/app.routes';

import { importProvidersFrom } from '@angular/core';
import { CoreModule } from './app/core/core.module'; // ✅ Підключаємо CoreModule

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),

    // 🌍 i18n Translate
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

    // 🧩 CoreModule: interceptors, guards, services
    importProvidersFrom(CoreModule)
  ]
}).catch(err => console.error(err));
