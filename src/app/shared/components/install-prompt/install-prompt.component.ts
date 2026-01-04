import { Component, inject } from '@angular/core';
import { LucideAngularModule, Download, X, Smartphone } from 'lucide-angular';
import { PwaService } from '../../../core/services/pwa.service';

@Component({
  selector: 'app-install-prompt',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    @if (pwaService.shouldShowPrompt()) {
      <!-- Mobile Bottom Banner -->
      <div class="fixed bottom-0 left-0 right-0 z-50 p-4 lg:hidden animate-slide-up">
        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-dark-700 p-4">
          <div class="flex items-start gap-4">
            <!-- App Icon -->
            <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <lucide-icon [img]="SmartphoneIcon" class="w-7 h-7 text-white"></lucide-icon>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-slate-900 dark:text-white text-base">Install Changelog Hub</h3>
              <p class="text-slate-500 dark:text-dark-400 text-sm mt-0.5">Add to home screen for quick access</p>

              <!-- Buttons -->
              <div class="flex items-center gap-2 mt-3">
                <button
                  (click)="install()"
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium text-sm transition-colors"
                >
                  <lucide-icon [img]="DownloadIcon" class="w-4 h-4"></lucide-icon>
                  Install App
                </button>
                <button
                  (click)="dismiss()"
                  class="px-4 py-2.5 text-slate-500 dark:text-dark-400 hover:bg-slate-100 dark:hover:bg-dark-700 rounded-xl font-medium text-sm transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>

            <!-- Close Button -->
            <button
              (click)="dismiss()"
              class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-dark-200 transition-colors"
            >
              <lucide-icon [img]="CloseIcon" class="w-5 h-5"></lucide-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Banner (less intrusive) -->
      <div class="hidden lg:block fixed bottom-6 right-6 z-50 animate-slide-up">
        <div class="bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-slate-200 dark:border-dark-700 p-4 max-w-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <lucide-icon [img]="DownloadIcon" class="w-5 h-5 text-white"></lucide-icon>
            </div>
            <div class="flex-1">
              <p class="font-medium text-slate-900 dark:text-white text-sm">Install Changelog Hub</p>
              <p class="text-slate-500 dark:text-dark-400 text-xs">For quick access</p>
            </div>
            <button
              (click)="install()"
              class="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors"
            >
              Install
            </button>
            <button
              (click)="dismiss()"
              class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-dark-200"
            >
              <lucide-icon [img]="CloseIcon" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes slide-up {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    .animate-slide-up {
      animation: slide-up 0.3s ease-out;
    }
  `]
})
export class InstallPromptComponent {
  pwaService = inject(PwaService);

  DownloadIcon = Download;
  CloseIcon = X;
  SmartphoneIcon = Smartphone;

  async install(): Promise<void> {
    await this.pwaService.installApp();
  }

  dismiss(): void {
    this.pwaService.dismissPrompt();
  }
}
