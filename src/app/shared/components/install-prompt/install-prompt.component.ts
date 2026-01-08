import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule, Download, X, Share, Plus } from 'lucide-angular';
import { PwaService } from '../../../core/services/pwa.service';

@Component({
  selector: 'app-install-prompt',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    @if (pwaService.shouldShowPrompt()) {
      <!-- Full Screen Overlay for Mobile -->
      <div class="fixed inset-0 z-50 lg:hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <!-- Bottom Sheet -->
        <div class="absolute bottom-0 left-0 right-0 animate-slide-up">
          <div class="bg-white dark:bg-dark-800 rounded-t-3xl shadow-2xl p-6 pb-8" style="padding-bottom: calc(env(safe-area-inset-bottom) + 2rem);">
            <!-- App Icon & Info -->
            <div class="flex flex-col items-center text-center mb-6">
              <img src="icons/icon-96x96.png" alt="Changelog Hub" class="w-20 h-20 rounded-2xl shadow-lg mb-4">
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Changelog Hub</h2>
              <p class="text-slate-500 dark:text-dark-400 text-sm mt-1">API Breaking Change Detector</p>
            </div>

            <!-- iOS Instructions -->
            @if (pwaService.isIOS() && !pwaService.hasNativeInstall()) {
              <div class="bg-slate-100 dark:bg-dark-700 rounded-xl p-4 mb-6">
                <p class="text-slate-700 dark:text-dark-200 text-sm text-center mb-3">
                  Pour installer l'application :
                </p>
                <div class="flex items-center justify-center gap-6">
                  <div class="flex flex-col items-center">
                    <div class="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-full flex items-center justify-center mb-2">
                      <lucide-icon [img]="ShareIcon" class="w-5 h-5 text-primary-600 dark:text-primary-400"></lucide-icon>
                    </div>
                    <span class="text-xs text-slate-500 dark:text-dark-400">1. Partager</span>
                  </div>
                  <div class="text-slate-300 dark:text-dark-600">→</div>
                  <div class="flex flex-col items-center">
                    <div class="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-full flex items-center justify-center mb-2">
                      <lucide-icon [img]="PlusIcon" class="w-5 h-5 text-primary-600 dark:text-primary-400"></lucide-icon>
                    </div>
                    <span class="text-xs text-slate-500 dark:text-dark-400">2. Ajouter</span>
                  </div>
                </div>
              </div>
            }

            <!-- Buttons -->
            <div class="space-y-3">
              <button
                (click)="install()"
                class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-semibold text-lg transition-all shadow-lg shadow-primary-500/30 active:scale-[0.98]"
              >
                <lucide-icon [img]="DownloadIcon" class="w-6 h-6"></lucide-icon>
                Télécharger
              </button>

              <button
                (click)="dismiss()"
                class="w-full px-6 py-4 text-slate-500 dark:text-dark-400 hover:bg-slate-100 dark:hover:bg-dark-700 rounded-2xl font-medium text-lg transition-colors active:scale-[0.98]"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Banner (less intrusive) -->
      <div class="hidden lg:block fixed bottom-6 right-6 z-50 animate-slide-up">
        <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-dark-700 p-4 max-w-sm">
          <div class="flex items-center gap-4">
            <img src="icons/icon-72x72.png" alt="Changelog Hub" class="w-12 h-12 rounded-xl shadow">
            <div class="flex-1">
              <p class="font-semibold text-slate-900 dark:text-white">Installer Changelog Hub</p>
              <p class="text-slate-500 dark:text-dark-400 text-sm">Accès rapide depuis votre bureau</p>
            </div>
            <button
              (click)="install()"
              class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <lucide-icon [img]="DownloadIcon" class="w-4 h-4"></lucide-icon>
              Installer
            </button>
            <button
              (click)="dismiss()"
              class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-dark-200 hover:bg-slate-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              <lucide-icon [img]="CloseIcon" class="w-5 h-5"></lucide-icon>
            </button>
          </div>
        </div>
      </div>
    }

    <!-- iOS Safari Instructions Modal -->
    @if (showIOSInstructions()) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="closeIOSInstructions()"></div>
        <div class="relative bg-white dark:bg-dark-800 rounded-3xl shadow-2xl p-6 max-w-sm w-full animate-scale-in">
          <button
            (click)="closeIOSInstructions()"
            class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-dark-200"
          >
            <lucide-icon [img]="CloseIcon" class="w-5 h-5"></lucide-icon>
          </button>

          <div class="text-center mb-6">
            <img src="icons/icon-96x96.png" alt="Changelog Hub" class="w-16 h-16 rounded-2xl shadow-lg mx-auto mb-4">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">Installation sur iOS</h3>
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-4 p-3 bg-slate-50 dark:bg-dark-700 rounded-xl">
              <div class="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-lg font-bold text-primary-600 dark:text-primary-400">1</span>
              </div>
              <div class="flex-1">
                <p class="text-slate-700 dark:text-dark-200 text-sm">
                  Appuyez sur <lucide-icon [img]="ShareIcon" class="w-4 h-4 inline text-primary-600"></lucide-icon> en bas de Safari
                </p>
              </div>
            </div>

            <div class="flex items-center gap-4 p-3 bg-slate-50 dark:bg-dark-700 rounded-xl">
              <div class="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-lg font-bold text-primary-600 dark:text-primary-400">2</span>
              </div>
              <div class="flex-1">
                <p class="text-slate-700 dark:text-dark-200 text-sm">
                  Faites défiler et appuyez sur <strong>"Sur l'écran d'accueil"</strong>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-4 p-3 bg-slate-50 dark:bg-dark-700 rounded-xl">
              <div class="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-lg font-bold text-primary-600 dark:text-primary-400">3</span>
              </div>
              <div class="flex-1">
                <p class="text-slate-700 dark:text-dark-200 text-sm">
                  Appuyez sur <strong>"Ajouter"</strong> en haut à droite
                </p>
              </div>
            </div>
          </div>

          <button
            (click)="closeIOSInstructions()"
            class="w-full mt-6 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
          >
            Compris !
          </button>
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
    @keyframes scale-in {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    .animate-slide-up {
      animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .animate-scale-in {
      animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class InstallPromptComponent {
  pwaService = inject(PwaService);

  DownloadIcon = Download;
  CloseIcon = X;
  ShareIcon = Share;
  PlusIcon = Plus;

  showIOSInstructions = signal<boolean>(false);

  async install(): Promise<void> {
    // Try native install first (Android/Chrome)
    const installed = await this.pwaService.installApp();

    // If no native install available (iOS), show instructions
    if (!installed && this.pwaService.isIOS()) {
      this.showIOSInstructions.set(true);
    }
  }

  dismiss(): void {
    this.pwaService.dismissPrompt();
  }

  closeIOSInstructions(): void {
    this.showIOSInstructions.set(false);
    this.pwaService.dismissPrompt();
  }
}
