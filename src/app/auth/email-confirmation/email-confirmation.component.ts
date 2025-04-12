import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderComponent } from 'src/app/shared/components/loader.component';

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, LoaderComponent],
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  public status: 'loading' | 'success' | 'error' = 'loading';
  public messageType: 'confirm-email' | 'reset-password' | 'reset-password-success' = 'confirm-email';
  public translationKey = '';
  public secondsLeft = 5;
  private redirectTimeout: any;
  private countdownInterval: any;

  ngOnInit(): void {
    this.messageType =
      (this.route.snapshot.queryParamMap.get('type') as
        | 'confirm-email'
        | 'reset-password'
        | 'reset-password-success') || 'confirm-email';

    // 💡 Обробка reset-password і reset-password-success без API
    if (this.messageType === 'reset-password') {
      this.status = 'success';
      this.translationKey = 'auth.resetLinkSent';
      return;
    }

    if (this.messageType === 'reset-password-success') {
      this.status = 'success';
      this.translationKey = 'auth.passwordSuccessfullyUpdated';
      return;
    }

    // 📧 Підтвердження email
    if (this.messageType === 'confirm-email') {
      const token = this.route.snapshot.queryParamMap.get('token');

      if (!token) {
        this.status = 'error';
        this.translationKey = 'auth.invalidConfirmationToken';
        return;
      }

      this.authService.confirmEmail(token).subscribe({
        next: () => {
          this.status = 'success';
          this.translationKey = 'auth.emailConfirmedSuccess';

          // ⏳ Таймер переадресації
          this.countdownInterval = setInterval(() => {
            if (this.secondsLeft > 0) this.secondsLeft--;
          }, 1000);

          this.redirectTimeout = setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, this.secondsLeft * 1000);
        },
        error: () => {
          this.status = 'error';
          this.translationKey = 'auth.emailConfirmedError';
        }
      });
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.redirectTimeout);
    clearInterval(this.countdownInterval);
  }
}
