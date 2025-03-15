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
  DEFAULT_LANGUAGE // ✅ Добавлен недостающий импорт
} from '@ngx-translate/core';
import { HttpLoaderFactory } from './providers/translate-loader';
import { CustomMissingTranslationHandler } from './providers/custom-missing-translation-handler'; // ✅ Кастомный обработчик
import { routes } from './app/app.routes';

// ✅ Добавляем TranslateLoader через factory
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient], // ✅ Исправлено: теперь зависит от HttpClient
    },
    TranslateService,
    TranslateStore,
    { provide: TranslateCompiler, useClass: TranslateFakeCompiler }, // ✅ Используем TranslateFakeCompiler
    { provide: TranslateParser, useClass: TranslateDefaultParser }, // ✅ Используем TranslateDefaultParser
    { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler }, // ✅ Используем кастомный обработчик
    { provide: USE_DEFAULT_LANG, useValue: 'ua' }, // ✅ Устанавливаем язык по умолчанию
    { provide: DEFAULT_LANGUAGE, useExisting: USE_DEFAULT_LANG }, // ✅ Исправлено: добавлен DEFAULT_LANGUAGE
    { provide: ISOLATE_TRANSLATE_SERVICE, useValue: false }, // ✅ Отключаем изолированные переводы
    { provide: USE_EXTEND, useValue: true } // ✅ Добавлен недостающий провайдер
  ]
}).catch(err => console.error(err));
