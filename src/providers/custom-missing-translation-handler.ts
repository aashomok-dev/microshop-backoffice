import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    console.warn(`❌ Перевод отсутствует: ${params.key}`);
    return `[${params.key}]`; // Возвращаем ключ перевода в квадратных скобках
  }
}
