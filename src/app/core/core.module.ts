import { NgModule, Optional, SkipSelf } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  providers: [
    AuthService,
    CookieService,
    provideHttpClient(withInterceptors([AuthInterceptor])) // Правильне підключення функціонального інтерсептора
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('❌ CoreModule вже був імпортований. Імпортуй його лише один раз у main.ts!');
    }
  }
}
