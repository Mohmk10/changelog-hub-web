import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);
  private loadingSignal = signal<boolean>(true);

  user = this.userSignal.asReadonly();
  token = this.tokenSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  isAuthenticated = computed(() => !!this.userSignal());

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuth();
  }

  private checkAuth(): void {
    const token = localStorage.getItem('changelog-hub-token');
    if (token) {
      this.tokenSignal.set(token);
      this.validateToken(token);
    } else {
      this.loadingSignal.set(false);
    }
  }

  private validateToken(token: string): void {
    this.http.get<User>(`${environment.apiUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (user) => {
        this.userSignal.set(user);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.logout();
        this.loadingSignal.set(false);
      }
    });
  }

  loginWithGithub(): void {
    window.location.href = `${environment.apiUrl}/oauth2/authorization/github`;
  }

  handleOAuthCallback(token: string): void {
    localStorage.setItem('changelog-hub-token', token);
    this.tokenSignal.set(token);
    this.validateToken(token);
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    localStorage.removeItem('changelog-hub-token');
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    this.router.navigate(['/dashboard']);
  }

  getAuthHeaders(): { Authorization: string } | {} {
    const token = this.tokenSignal();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
