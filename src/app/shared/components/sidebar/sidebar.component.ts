import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, GitCompare, FileText, BarChart3, Settings, Github, LogOut, LogIn } from 'lucide-angular';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, ThemeToggleComponent],
  template: `
    <aside class="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-dark-800 border-r border-slate-200 dark:border-dark-700 flex flex-col">
      <!-- Logo -->
      <div class="p-6 border-b border-slate-200 dark:border-dark-700">
        <div class="flex items-center gap-3">
<img src="icons/icon-72x72.png" alt="Changelog Hub" class="w-10 h-10">
          <div>
            <h1 class="font-bold text-slate-900 dark:text-white">Changelog Hub</h1>
            <p class="text-xs text-slate-500 dark:text-dark-400">API Change Detector</p>
          </div>
        </div>
      </div>

      <!-- User Info (si connecté) -->
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
      <nav class="flex-1 p-4 space-y-1">
        <a routerLink="/dashboard" routerLinkActive="sidebar-item-active" class="sidebar-item">
          <lucide-icon [img]="DashboardIcon" class="w-5 h-5"></lucide-icon>
          <span>Dashboard</span>
        </a>
        <a routerLink="/compare" routerLinkActive="sidebar-item-active" class="sidebar-item">
          <lucide-icon [img]="GitCompareIcon" class="w-5 h-5"></lucide-icon>
          <span>Compare</span>
        </a>
        <a routerLink="/changelog" routerLinkActive="sidebar-item-active" class="sidebar-item">
          <lucide-icon [img]="FileTextIcon" class="w-5 h-5"></lucide-icon>
          <span>Changelog</span>
        </a>
        <a routerLink="/analytics" routerLinkActive="sidebar-item-active" class="sidebar-item">
          <lucide-icon [img]="BarChartIcon" class="w-5 h-5"></lucide-icon>
          <span>Analytics</span>
        </a>
        <a routerLink="/settings" routerLinkActive="sidebar-item-active" class="sidebar-item">
          <lucide-icon [img]="SettingsIcon" class="w-5 h-5"></lucide-icon>
          <span>Settings</span>
        </a>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-200 dark:border-dark-700 space-y-3">
        <!-- Login/Logout Button -->
        @if (authService.isAuthenticated()) {
          <button (click)="authService.logout()" class="sidebar-item w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
            <lucide-icon [img]="LogOutIcon" class="w-5 h-5"></lucide-icon>
            <span>Logout</span>
          </button>
        } @else {
          <button (click)="authService.loginWithGithub()" class="sidebar-item w-full text-slate-700 dark:text-dark-200 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400">
            <lucide-icon [img]="GithubIcon" class="w-5 h-5"></lucide-icon>
            <span>Login with GitHub</span>
          </button>
        }

        <!-- Theme Toggle -->
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-500 dark:text-dark-400">Theme</span>
          <app-theme-toggle />
        </div>

        <!-- GitHub Link -->
        <a href="https://github.com/Mohmk10/changelog-hub" target="_blank" class="flex items-center gap-2 text-sm text-slate-500 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <lucide-icon [img]="GithubIcon" class="w-4 h-4"></lucide-icon>
          <span>View on GitHub</span>
        </a>

        <!-- Version -->
        <div class="flex items-center gap-2 text-xs text-slate-400 dark:text-dark-500">
          <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
          <span>v1.0.0 - All systems operational</span>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  authService = inject(AuthService);

  DashboardIcon = LayoutDashboard;
  GitCompareIcon = GitCompare;
  FileTextIcon = FileText;
  BarChartIcon = BarChart3;
  SettingsIcon = Settings;
  GithubIcon = Github;
  LogOutIcon = LogOut;
  LogInIcon = LogIn;
}
