import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'compare',
    loadComponent: () => import('./features/compare/compare.component').then(m => m.CompareComponent)
  },
  {
    path: 'changelog',
    loadComponent: () => import('./features/changelog/changelog.component').then(m => m.ChangelogComponent)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];
