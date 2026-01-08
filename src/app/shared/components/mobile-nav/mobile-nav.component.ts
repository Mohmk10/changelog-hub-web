import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Menu, X, LayoutDashboard, GitCompare, FileText, BarChart3, Settings, Github, LogOut } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, ThemeToggleComponent],
  template: `
    <!-- Top Bar -->
    <header class="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-dark-800 border-b border-slate-200 dark:border-dark-700 z-50 flex items-center justify-between px-4" style="padding-top: env(safe-area-inset-top);">
      <button (click)="toggle.emit()" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors">
        <lucide-icon [img]="isOpen ? CloseIcon : MenuIcon" class="w-6 h-6 text-slate-700 dark:text-dark-200"></lucide-icon>
      </button>

      <div class="flex items-center gap-2">
        <img src="icons/icon-72x72.png" alt="Logo" class="w-8 h-8">
        <span class="font-bold text-slate-900 dark:text-white text-sm">Changelog Hub</span>
      </div>

      <app-theme-toggle />
    </header>

    <!-- Slide-out Menu -->
    <aside
      class="fixed top-0 left-0 h-full w-72 bg-white dark:bg-dark-800 z-50 transform transition-transform duration-300 ease-in-out"
      [class.translate-x-0]="isOpen"
      [class.-translate-x-full]="!isOpen"
      style="padding-top: env(safe-area-inset-top); padding-left: env(safe-area-inset-left);">

      <!-- Header -->
      <div class="p-4 border-b border-slate-200 dark:border-dark-700 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="icons/icon-72x72.png" alt="Logo" class="w-10 h-10">
          <div>
            <h1 class="font-bold text-slate-900 dark:text-white">Changelog Hub</h1>
            <p class="text-xs text-slate-500 dark:text-dark-400">API Change Detector</p>
          </div>
        </div>
        <button (click)="toggle.emit()" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-700">
          <lucide-icon [img]="CloseIcon" class="w-5 h-5 text-slate-500"></lucide-icon>
        </button>
      </div>

      <!-- User Info -->
      @if (authService.isAuthenticated()) {
        <div class="p-4 border-b border-slate-200 dark:border-dark-700">
          <div class="flex items-center gap-3">
            <img [src]="authService.user()?.avatarUrl" alt="Avatar" class="w-10 h-10 rounded-full">
            <div class="flex-1 min-w-0">
              <p class="font-medium text-slate-900 dark:text-white truncate">{{ authService.user()?.username }}</p>
              <p class="text-xs text-slate-500 dark:text-dark-400 truncate">{{ authService.user()?.email }}</p>
            </div>
          </div>
        </div>
      }

      <!-- Navigation -->
      <nav class="p-4 space-y-1 overflow-y-auto" style="max-height: calc(100vh - 280px);">
        <a routerLink="/dashboard" routerLinkActive="bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400"
           (click)="toggle.emit()"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors">
          <lucide-icon [img]="DashboardIcon" class="w-5 h-5"></lucide-icon>
          <span>Dashboard</span>
        </a>
        <a routerLink="/compare" routerLinkActive="bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400"
           (click)="toggle.emit()"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors">
          <lucide-icon [img]="GitCompareIcon" class="w-5 h-5"></lucide-icon>
          <span>Compare</span>
        </a>
        <a routerLink="/changelog" routerLinkActive="bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400"
           (click)="toggle.emit()"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors">
          <lucide-icon [img]="FileTextIcon" class="w-5 h-5"></lucide-icon>
          <span>Changelog</span>
        </a>
        <a routerLink="/analytics" routerLinkActive="bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400"
           (click)="toggle.emit()"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors">
          <lucide-icon [img]="BarChartIcon" class="w-5 h-5"></lucide-icon>
          <span>Analytics</span>
        </a>
        <a routerLink="/settings" routerLinkActive="bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400"
           (click)="toggle.emit()"
           class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors">
          <lucide-icon [img]="SettingsIcon" class="w-5 h-5"></lucide-icon>
          <span>Settings</span>
        </a>
      </nav>

      <!-- Footer -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-dark-700" style="padding-bottom: env(safe-area-inset-bottom);">
        @if (authService.isAuthenticated()) {
          <button (click)="logout()" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <lucide-icon [img]="LogOutIcon" class="w-5 h-5"></lucide-icon>
            <span>Logout</span>
          </button>
        } @else {
          <button (click)="login()" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
            <lucide-icon [img]="GithubIcon" class="w-5 h-5"></lucide-icon>
            <span>Login with GitHub</span>
          </button>
        }
      </div>
    </aside>
  `
})
export class MobileNavComponent {
  @Input() isOpen = false;
  @Output() toggle = new EventEmitter<void>();

  authService = inject(AuthService);

  MenuIcon = Menu;
  CloseIcon = X;
  DashboardIcon = LayoutDashboard;
  GitCompareIcon = GitCompare;
  FileTextIcon = FileText;
  BarChartIcon = BarChart3;
  SettingsIcon = Settings;
  GithubIcon = Github;
  LogOutIcon = LogOut;

  login(): void {
    this.authService.loginWithGithub();
  }

  logout(): void {
    this.authService.logout();
    this.toggle.emit();
  }
}
