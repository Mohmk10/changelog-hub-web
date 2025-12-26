import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, GitCompare, FileText, BarChart3, Settings, Github, ExternalLink } from 'lucide-angular';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, ThemeToggleComponent],
  template: `
    <aside class="fixed left-0 top-0 h-full w-64 sidebar flex flex-col transition-colors">
      <!-- Logo -->
      <div class="p-6 border-b border-slate-200 dark:border-dark-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
            <span class="text-white text-lg">&#9889;</span>
          </div>
          <div>
            <h1 class="text-lg font-bold text-slate-900 dark:text-white">Changelog Hub</h1>
            <p class="text-slate-500 dark:text-dark-400 text-xs">API Breaking Change Detector</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4">
        <p class="text-xs font-semibold text-slate-400 dark:text-dark-500 uppercase tracking-wider mb-3 px-4">Menu</p>
        <ul class="space-y-1">
          @for (item of menuItems; track item.path) {
            <li>
              <a
                [routerLink]="item.path"
                routerLinkActive="sidebar-item-active"
                [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
                class="sidebar-item"
              >
                <lucide-icon [img]="item.icon" class="w-5 h-5"></lucide-icon>
                {{ item.label }}
              </a>
            </li>
          }
        </ul>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-200 dark:border-dark-700">
        <div class="flex items-center justify-between mb-4 px-4">
          <span class="text-slate-500 dark:text-dark-400 text-sm">Theme</span>
          <app-theme-toggle></app-theme-toggle>
        </div>

        <a
          href="https://github.com/Mohmk10/changelog-hub"
          target="_blank"
          class="flex items-center justify-between px-4 py-3 rounded-lg text-slate-500 dark:text-dark-400 hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-slate-700 dark:hover:text-white transition-colors group"
        >
          <div class="flex items-center gap-3">
            <lucide-icon [img]="GithubIcon" class="w-5 h-5"></lucide-icon>
            <span>GitHub</span>
          </div>
          <lucide-icon [img]="ExternalLinkIcon" class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"></lucide-icon>
        </a>

        <div class="mt-4 px-4">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span class="text-slate-400 dark:text-dark-500 text-xs">v1.0.0 - All systems operational</span>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  GithubIcon = Github;
  ExternalLinkIcon = ExternalLink;

  menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/compare', label: 'Compare', icon: GitCompare },
    { path: '/changelog', label: 'Changelog', icon: FileText },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];
}
