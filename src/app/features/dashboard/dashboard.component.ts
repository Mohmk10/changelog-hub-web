import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LucideAngularModule, GitCompare, AlertTriangle, TrendingUp, Shield } from 'lucide-angular';
import { ChangelogService } from '../../core/services/changelog.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Dashboard</h1>
          <p class="text-dark-400 mt-1">Overview of your API changes</p>
        </div>
        <a routerLink="/compare" class="btn-primary flex items-center gap-2">
          <lucide-icon [img]="GitCompareIcon" class="w-4 h-4"></lucide-icon>
          New Comparison
        </a>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-dark-400 text-sm">Total Comparisons</p>
              <p class="text-3xl font-bold text-white mt-1">{{ stats.totalComparisons }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <lucide-icon [img]="GitCompareIcon" class="w-6 h-6 text-primary-400"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-dark-400 text-sm">Breaking Changes</p>
              <p class="text-3xl font-bold text-red-400 mt-1">{{ stats.breakingChanges }}</p>
            </div>
            <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <lucide-icon [img]="AlertTriangleIcon" class="w-6 h-6 text-red-400"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-dark-400 text-sm">Average Risk Score</p>
              <p class="text-3xl font-bold text-yellow-400 mt-1">{{ stats.avgRiskScore }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <lucide-icon [img]="TrendingUpIcon" class="w-6 h-6 text-yellow-400"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-dark-400 text-sm">Stability Grade</p>
              <p class="text-3xl font-bold text-green-400 mt-1">{{ stats.stabilityGrade }}</p>
            </div>
            <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <lucide-icon [img]="ShieldIcon" class="w-6 h-6 text-green-400"></lucide-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <h2 class="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a routerLink="/compare" class="p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors group">
            <lucide-icon [img]="GitCompareIcon" class="w-8 h-8 text-primary-400 mb-3"></lucide-icon>
            <h3 class="font-medium text-white group-hover:text-primary-400">Compare APIs</h3>
            <p class="text-dark-400 text-sm mt-1">Upload two specs to detect changes</p>
          </a>
          <a routerLink="/changelog" class="p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors group">
            <span class="text-3xl mb-3 block">&#128221;</span>
            <h3 class="font-medium text-white group-hover:text-primary-400">View Changelog</h3>
            <p class="text-dark-400 text-sm mt-1">Browse all detected changes</p>
          </a>
          <a routerLink="/analytics" class="p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors group">
            <span class="text-3xl mb-3 block">&#128202;</span>
            <h3 class="font-medium text-white group-hover:text-primary-400">Analytics</h3>
            <p class="text-dark-400 text-sm mt-1">View trends and insights</p>
          </a>
        </div>
      </div>

      <!-- Recent Comparisons -->
      <div class="card">
        <h2 class="text-lg font-semibold text-white mb-4">Recent Comparisons</h2>
        @if (recentComparisons.length === 0) {
          <div class="text-center py-8">
            <p class="text-dark-400">No comparisons yet</p>
            <a routerLink="/compare" class="text-primary-400 hover:text-primary-300 mt-2 inline-block">
              Start your first comparison &rarr;
            </a>
          </div>
        } @else {
          <div class="space-y-3">
            @for (comparison of recentComparisons; track comparison.id) {
              <div class="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                <div>
                  <p class="text-white font-medium">{{ comparison.oldSpec.name }} &rarr; {{ comparison.newSpec.name }}</p>
                  <p class="text-dark-400 text-sm">{{ comparison.timestamp | date:'medium' }}</p>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-red-400">{{ comparison.summary.breakingChanges }} breaking</span>
                  <span class="px-2 py-1 bg-dark-600 rounded text-sm">Score: {{ comparison.summary.riskScore }}</span>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardComponent {
  private changelogService = inject(ChangelogService);

  GitCompareIcon = GitCompare;
  AlertTriangleIcon = AlertTriangle;
  TrendingUpIcon = TrendingUp;
  ShieldIcon = Shield;

  stats = {
    totalComparisons: 12,
    breakingChanges: 23,
    avgRiskScore: 65,
    stabilityGrade: 'B'
  };

  get recentComparisons() {
    return this.changelogService.getRecentComparisons().slice(0, 5);
  }
}
