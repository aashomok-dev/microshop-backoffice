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

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.status = 'error';
      return;
    }

    this.authService.confirmEmail(token).subscribe({
      next: () => {
        this.status = 'success';
        setTimeout(() => {
          void this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (err) => {
        console.error('❌ Email confirmation error:', err);
        this.status = 'error';
      }
    });
  }
}
