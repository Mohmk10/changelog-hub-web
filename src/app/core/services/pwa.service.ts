import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt: any = null;

  canInstall = signal<boolean>(false);
  isInstalled = signal<boolean>(false);
  dismissed = signal<boolean>(false);
  isIOS = signal<boolean>(false);
  isMobile = signal<boolean>(false);

  constructor() {
    this.detectDevice();
    this.checkIfInstalled();
    this.listenForInstallPrompt();
    this.listenForAppInstalled();
  }

  private detectDevice(): void {
    const userAgent = window.navigator.userAgent.toLowerCase();

    // Detect iOS
    const isIOS = /iphone|ipad|ipod/.test(userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    this.isIOS.set(isIOS);

    // Detect mobile/tablet
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent) ||
      window.innerWidth <= 1024;
    this.isMobile.set(isMobile);
  }

  private checkIfInstalled(): void {
    // Check if app is already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;

    this.isInstalled.set(isStandalone);

    // On iOS, if not standalone, we can still show install prompt
    // On Android, we wait for beforeinstallprompt event
    if (this.isIOS() && !isStandalone) {
      this.canInstall.set(true);
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
    // For Android/Chrome - use native prompt
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        this.canInstall.set(false);
        this.deferredPrompt = null;
        return true;
      }
      return false;
    }

    // For iOS - cannot programmatically install, return false
    // The component will show iOS-specific instructions
    return false;
  }

  dismissPrompt(): void {
    this.dismissed.set(true);
    // Only dismiss for this session - will show again on next visit
    // No localStorage persistence = shows every time
  }

  shouldShowPrompt(): boolean {
    // Show on mobile devices if not installed and not dismissed in current session
    return this.isMobile() && this.canInstall() && !this.isInstalled() && !this.dismissed();
  }

  hasNativeInstall(): boolean {
    return this.deferredPrompt !== null;
  }
}
