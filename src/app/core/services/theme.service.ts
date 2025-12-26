import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'changelog-hub-theme';

  theme = signal<Theme>(this.getStoredTheme());

  constructor() {
    effect(() => {
      this.applyTheme(this.theme());
    });

    // Listen for system theme changes
    if (typeof window !== 'undefined') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.theme() === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  private getStoredTheme(): Theme {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme;
    return stored || 'dark';
  }

  private getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') return;

    const effectiveTheme = theme === 'system' ? this.getSystemTheme() : theme;
    const root = document.documentElement;

    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  toggleTheme(): void {
    this.theme.update(current => {
      if (current === 'dark') return 'light';
      if (current === 'light') return 'dark';
      return this.getSystemTheme() === 'dark' ? 'light' : 'dark';
    });
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }
}
