import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt: any = null;

  canInstall = signal<boolean>(false);
  isInstalled = signal<boolean>(false);
  dismissed = signal<boolean>(false);

  constructor() {
    this.checkIfInstalled();
    this.listenForInstallPrompt();
    this.listenForAppInstalled();
  }

  private checkIfInstalled(): void {
    // Check if app is already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;

    this.isInstalled.set(isStandalone);

    // Check if user previously dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      // Show again after 7 days
      this.dismissed.set(daysSinceDismissed < 7);
    }
  }

  private listenForInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.canInstall.set(true);
    });
  }

  private listenForAppInstalled(): void {
    window.addEventListener('appinstalled', () => {
      this.isInstalled.set(true);
      this.canInstall.set(false);
      this.deferredPrompt = null;
    });
  }

  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      this.canInstall.set(false);
      this.deferredPrompt = null;
      return true;
    }

    return false;
  }

  dismissPrompt(): void {
    this.dismissed.set(true);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  }

  shouldShowPrompt(): boolean {
    return this.canInstall() && !this.isInstalled() && !this.dismissed();
  }
}
