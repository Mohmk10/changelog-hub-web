import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Sun, Moon, Monitor, Save, Trash2, Download, Upload, Bell, Shield, Zap, Database } from 'lucide-angular';
import { ThemeService, Theme } from '../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p class="text-slate-500 dark:text-dark-400 mt-1">Configure your Changelog Hub preferences</p>
      </div>

      <!-- Theme Settings -->
      <div class="card">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center">
            <lucide-icon [img]="themeService.theme() === 'dark' ? MoonIcon : SunIcon" class="w-5 h-5 text-primary-600 dark:text-primary-400"></lucide-icon>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
            <p class="text-slate-500 dark:text-dark-400 text-sm">Customize how Changelog Hub looks</p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <button
            (click)="setTheme('light')"
            class="p-4 rounded-xl border-2 transition-all"
            [class]="themeService.theme() === 'light' ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-slate-200 dark:border-dark-700 hover:border-slate-300 dark:hover:border-dark-600'"
          >
            <lucide-icon [img]="SunIcon" class="w-6 h-6 mx-auto mb-2" [class]="themeService.theme() === 'light' ? 'text-primary-600' : 'text-slate-400 dark:text-dark-400'"></lucide-icon>
            <p class="text-sm font-medium" [class]="themeService.theme() === 'light' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-dark-300'">Light</p>
          </button>

          <button
            (click)="setTheme('dark')"
            class="p-4 rounded-xl border-2 transition-all"
            [class]="themeService.theme() === 'dark' ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-slate-200 dark:border-dark-700 hover:border-slate-300 dark:hover:border-dark-600'"
          >
            <lucide-icon [img]="MoonIcon" class="w-6 h-6 mx-auto mb-2" [class]="themeService.theme() === 'dark' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-dark-400'"></lucide-icon>
            <p class="text-sm font-medium" [class]="themeService.theme() === 'dark' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-dark-300'">Dark</p>
          </button>

          <button
            (click)="setTheme('system')"
            class="p-4 rounded-xl border-2 transition-all"
            [class]="themeService.theme() === 'system' ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-slate-200 dark:border-dark-700 hover:border-slate-300 dark:hover:border-dark-600'"
          >
            <lucide-icon [img]="MonitorIcon" class="w-6 h-6 mx-auto mb-2" [class]="themeService.theme() === 'system' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-dark-400'"></lucide-icon>
            <p class="text-sm font-medium" [class]="themeService.theme() === 'system' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-dark-300'">System</p>
          </button>
        </div>
      </div>

      <!-- Detection Rules -->
      <div class="card">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex items-center justify-center">
            <lucide-icon [img]="ShieldIcon" class="w-5 h-5 text-amber-600 dark:text-amber-400"></lucide-icon>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Detection Rules</h2>
            <p class="text-slate-500 dark:text-dark-400 text-sm">Configure how changes are detected</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-700 rounded-xl">
            <div>
              <p class="font-medium text-slate-900 dark:text-white">Strict Mode</p>
              <p class="text-slate-500 dark:text-dark-400 text-sm">Flag all schema changes as potentially breaking</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" [(ngModel)]="settings.strictMode" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 dark:bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-700 rounded-xl">
            <div>
              <p class="font-medium text-slate-900 dark:text-white">Ignore Deprecated</p>
              <p class="text-slate-500 dark:text-dark-400 text-sm">Skip changes to deprecated endpoints</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" [(ngModel)]="settings.ignoreDeprecated" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 dark:bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-700 rounded-xl">
            <div>
              <p class="font-medium text-slate-900 dark:text-white">Auto Migration Suggestions</p>
              <p class="text-slate-500 dark:text-dark-400 text-sm">Generate migration guides for breaking changes</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" [(ngModel)]="settings.autoMigration" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 dark:bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="card">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
            <lucide-icon [img]="BellIcon" class="w-5 h-5 text-blue-600 dark:text-blue-400"></lucide-icon>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h2>
            <p class="text-slate-500 dark:text-dark-400 text-sm">Manage your notification preferences</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-700 rounded-xl">
            <div>
              <p class="font-medium text-slate-900 dark:text-white">Breaking Change Alerts</p>
              <p class="text-slate-500 dark:text-dark-400 text-sm">Get notified when breaking changes are detected</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" [(ngModel)]="settings.breakingAlerts" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 dark:bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-700 rounded-xl">
            <div>
              <p class="font-medium text-slate-900 dark:text-white">Weekly Summary</p>
              <p class="text-slate-500 dark:text-dark-400 text-sm">Receive a weekly digest of all changes</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" [(ngModel)]="settings.weeklySummary" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 dark:bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Data Management -->
      <div class="card">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <lucide-icon [img]="DatabaseIcon" class="w-5 h-5 text-emerald-600 dark:text-emerald-400"></lucide-icon>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Data Management</h2>
            <p class="text-slate-500 dark:text-dark-400 text-sm">Export, import, or clear your data</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button class="btn-secondary flex items-center justify-center gap-2">
            <lucide-icon [img]="DownloadIcon" class="w-4 h-4"></lucide-icon>
            Export Data
          </button>
          <button class="btn-secondary flex items-center justify-center gap-2">
            <lucide-icon [img]="UploadIcon" class="w-4 h-4"></lucide-icon>
            Import Data
          </button>
          <button class="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
            <lucide-icon [img]="Trash2Icon" class="w-4 h-4"></lucide-icon>
            Clear All Data
          </button>
        </div>

        <div class="mt-6 p-4 bg-slate-50 dark:bg-dark-700 rounded-xl">
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-500 dark:text-dark-400">Storage used</span>
            <span class="font-medium text-slate-900 dark:text-white">2.4 MB / 50 MB</span>
          </div>
          <div class="mt-2 w-full h-2 bg-slate-200 dark:bg-dark-600 rounded-full overflow-hidden">
            <div class="h-full bg-primary-500 rounded-full" style="width: 4.8%"></div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <button class="btn-primary flex items-center gap-2" (click)="saveSettings()">
          <lucide-icon [img]="SaveIcon" class="w-4 h-4"></lucide-icon>
          Save Changes
        </button>
      </div>
    </div>
  `
})
export class SettingsComponent {
  themeService = inject(ThemeService);

  SunIcon = Sun;
  MoonIcon = Moon;
  MonitorIcon = Monitor;
  SaveIcon = Save;
  Trash2Icon = Trash2;
  DownloadIcon = Download;
  UploadIcon = Upload;
  BellIcon = Bell;
  ShieldIcon = Shield;
  ZapIcon = Zap;
  DatabaseIcon = Database;

  settings = {
    strictMode: false,
    ignoreDeprecated: true,
    autoMigration: true,
    breakingAlerts: true,
    weeklySummary: false
  };

  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }

  saveSettings() {
    localStorage.setItem('changelog-hub-settings', JSON.stringify(this.settings));
  }
}
