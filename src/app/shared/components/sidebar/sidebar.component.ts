import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, GitCompare, FileText, BarChart3, Settings, Github } from 'lucide-angular';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, ThemeToggleComponent],
  template: `
    <aside class="fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-700 flex flex-col transition-colors">
      <div class="p-6 border-b border-gray-200 dark:border-dark-700">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span class="text-primary-500">&#9889;</span>
          Changelog Hub
        </h1>
        <p class="text-gray-500 dark:text-dark-400 text-sm mt-1">API Breaking Change Detector</p>
      </div>

      <nav class="flex-1 p-4">
        <ul class="space-y-2">
          @for (item of menuItems; track item.path) {
            <li>
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-primary-600 text-white"
                [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <lucide-icon [img]="item.icon" class="w-5 h-5"></lucide-icon>
                {{ item.label }}
              </a>
            </li>
          }
        </ul>
      </nav>

      <div class="p-4 border-t border-gray-200 dark:border-dark-700">
        <div class="flex items-center justify-between mb-4 px-4">
          <span class="text-gray-500 dark:text-dark-400 text-sm">Theme</span>
          <app-theme-toggle></app-theme-toggle>
        </div>
        <a
          href="https://github.com/Mohmk10/changelog-hub"
          target="_blank"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <lucide-icon [img]="GithubIcon" class="w-5 h-5"></lucide-icon>
          GitHub
        </a>
        <p class="text-gray-400 dark:text-dark-500 text-xs mt-4 px-4">v1.0.0</p>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  GithubIcon = Github;

  menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/compare', label: 'Compare', icon: GitCompare },
    { path: '/changelog', label: 'Changelog', icon: FileText },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];
}
