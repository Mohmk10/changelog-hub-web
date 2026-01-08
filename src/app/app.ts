import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { MobileNavComponent } from './shared/components/mobile-nav/mobile-nav.component';
import { InstallPromptComponent } from './shared/components/install-prompt/install-prompt.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, MobileNavComponent, InstallPromptComponent],
  template: `
    <!-- Desktop Sidebar (hidden on mobile) -->
    <app-sidebar class="hidden lg:block" />

    <!-- Mobile Navigation (hidden on desktop) -->
    <app-mobile-nav
      class="lg:hidden"
      [isOpen]="mobileMenuOpen()"
      (toggle)="toggleMobileMenu()"
    />

    <!-- Main Content -->
    <main
      class="min-h-screen bg-slate-50 dark:bg-dark-900 transition-all duration-300 lg:ml-64 pt-16 lg:pt-0"
    >
      <div class="p-4 lg:p-8">
        <router-outlet />
      </div>
    </main>

    <!-- Mobile Menu Overlay -->
    @if (mobileMenuOpen()) {
      <div
        class="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
        (click)="toggleMobileMenu()"
      ></div>
    }

    <!-- PWA Install Prompt -->
    <app-install-prompt />
  `
})
export class App {
  private themeService = inject(ThemeService);
  mobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }
}
