import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-900">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-slate-600 dark:text-dark-300">Authenticating with GitHub...</p>
      </div>
    </div>
  `
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.handleOAuthCallback(token);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
