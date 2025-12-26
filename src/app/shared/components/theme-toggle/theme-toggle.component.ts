import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { LucideAngularModule, Sun, Moon } from 'lucide-angular';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <button
      (click)="themeService.toggleTheme()"
      class="p-2 rounded-lg bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors"
      [attr.aria-label]="themeService.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      @if (themeService.theme() === 'dark') {
        <lucide-icon [img]="SunIcon" class="w-5 h-5 text-yellow-400"></lucide-icon>
      } @else {
        <lucide-icon [img]="MoonIcon" class="w-5 h-5 text-dark-600"></lucide-icon>
      }
    </button>
  `
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
  SunIcon = Sun;
  MoonIcon = Moon;
}
