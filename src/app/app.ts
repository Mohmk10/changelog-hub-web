import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors">
      <app-sidebar></app-sidebar>
      <main class="ml-64 p-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class App {
  // Inject ThemeService to initialize theme on app start
  private themeService = inject(ThemeService);
}
