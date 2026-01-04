import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LucideAngularModule, GitCompare, AlertTriangle, TrendingUp, Shield, ArrowRight, Clock } from 'lucide-angular';
import { ChangelogService } from '../../core/services/changelog.service';
import { AuthService } from '../../core/services/auth.service';
import { ComparisonResult } from '../../core/models/breaking-change.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, DatePipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p class="text-slate-500 dark:text-dark-400 mt-1">Overview of your API changes</p>
        </div>
        <a routerLink="/compare" class="btn-primary flex items-center gap-2">
          <lucide-icon [img]="GitCompareIcon" class="w-4 h-4"></lucide-icon>
          New Comparison
        </a>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-500 dark:text-dark-400 text-sm font-medium">Total Comparisons</p>
              <p class="text-3xl font-bold text-slate-900 dark:text-white mt-1">{{ stats().totalComparisons }}</p>
              <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                <span>&#8593; 12%</span>
                <span class="text-slate-400 dark:text-dark-500">vs last week</span>
              </p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
              <lucide-icon [img]="GitCompareIcon" class="w-6 h-6 text-white"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-500 dark:text-dark-400 text-sm font-medium">Breaking Changes</p>
              <p class="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{{ stats().breakingChanges }}</p>
              <p class="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                <span>&#8593; 5</span>
                <span class="text-slate-400 dark:text-dark-500">new this week</span>
              </p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <lucide-icon [img]="AlertTriangleIcon" class="w-6 h-6 text-white"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-500 dark:text-dark-400 text-sm font-medium">Average Risk Score</p>
              <p class="text-3xl font-bold text-amber-600 dark:text-yellow-400 mt-1">{{ stats().avgRiskScore }}</p>
              <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                <span>&#8595; 8</span>
                <span class="text-slate-400 dark:text-dark-500">improved</span>
              </p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
              <lucide-icon [img]="TrendingUpIcon" class="w-6 h-6 text-white"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-500 dark:text-dark-400 text-sm font-medium">Stability Grade</p>
              <p class="text-3xl font-bold text-emerald-600 dark:text-green-400 mt-1">{{ stats().stabilityGrade }}</p>
              <p class="text-xs text-slate-400 dark:text-dark-500 mt-2">
                Above average
              </p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <lucide-icon [img]="ShieldIcon" class="w-6 h-6 text-white"></lucide-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a routerLink="/compare" class="group p-5 bg-slate-50 dark:bg-dark-700 rounded-xl hover:bg-primary-50 dark:hover:bg-dark-600 transition-all border border-slate-100 dark:border-transparent hover:border-primary-200 dark:hover:border-primary-500/30">
            <div class="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-500/30 transition-colors">
              <lucide-icon [img]="GitCompareIcon" class="w-5 h-5 text-primary-600 dark:text-primary-400"></lucide-icon>
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">Compare APIs</h3>
            <p class="text-slate-500 dark:text-dark-400 text-sm mt-1">Upload two specs to detect changes</p>
          </a>

          <a routerLink="/changelog" class="group p-5 bg-slate-50 dark:bg-dark-700 rounded-xl hover:bg-amber-50 dark:hover:bg-dark-600 transition-all border border-slate-100 dark:border-transparent hover:border-amber-200 dark:hover:border-amber-500/30">
            <div class="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 dark:group-hover:bg-amber-500/30 transition-colors">
              <span class="text-xl">&#128221;</span>
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">View Changelog</h3>
            <p class="text-slate-500 dark:text-dark-400 text-sm mt-1">Browse all detected changes</p>
          </a>

          <a routerLink="/analytics" class="group p-5 bg-slate-50 dark:bg-dark-700 rounded-xl hover:bg-emerald-50 dark:hover:bg-dark-600 transition-all border border-slate-100 dark:border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/30">
            <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/30 transition-colors">
              <span class="text-xl">&#128202;</span>
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">Analytics</h3>
            <p class="text-slate-500 dark:text-dark-400 text-sm mt-1">View trends and insights</p>
          </a>
        </div>
      </div>

      <!-- Recent Comparisons -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Recent Comparisons</h2>
          <a routerLink="/changelog" class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1">
            View all
            <lucide-icon [img]="ArrowRightIcon" class="w-4 h-4"></lucide-icon>
          </a>
        </div>

        @if (recentComparisons().length === 0) {
          <div class="text-center py-12 bg-slate-50 dark:bg-dark-700/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-dark-600">
            <div class="w-16 h-16 bg-slate-100 dark:bg-dark-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <lucide-icon [img]="ClockIcon" class="w-8 h-8 text-slate-400 dark:text-dark-400"></lucide-icon>
            </div>
            <p class="text-slate-500 dark:text-dark-400 font-medium">No comparisons yet</p>
            <p class="text-slate-400 dark:text-dark-500 text-sm mt-1">Start by comparing two API specifications</p>
            <a routerLink="/compare" class="btn-primary inline-flex items-center gap-2 mt-4">
              <lucide-icon [img]="GitCompareIcon" class="w-4 h-4"></lucide-icon>
              Start your first comparison
            </a>
          </div>
        } @else {
          <div class="space-y-3">
            @for (comparison of recentComparisons(); track comparison.id) {
              <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-700 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-600 transition-colors cursor-pointer">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <lucide-icon [img]="GitCompareIcon" class="w-5 h-5 text-primary-600 dark:text-primary-400"></lucide-icon>
                  </div>
                  <div>
                    <p class="text-slate-900 dark:text-white font-medium">{{ comparison.oldSpec.name }} &rarr; {{ comparison.newSpec.name }}</p>
                    <p class="text-slate-500 dark:text-dark-400 text-sm">{{ comparison.timestamp | date:'medium' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="badge-breaking">{{ comparison.summary.breakingChanges }} breaking</span>
                  <span class="px-3 py-1.5 bg-slate-200 dark:bg-dark-600 rounded-lg text-sm font-medium text-slate-700 dark:text-dark-200">
                    Score: {{ comparison.summary.riskScore }}
                  </span>
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
  private authService = inject(AuthService);

  GitCompareIcon = GitCompare;
  AlertTriangleIcon = AlertTriangle;
  TrendingUpIcon = TrendingUp;
  ShieldIcon = Shield;
  ArrowRightIcon = ArrowRight;
  ClockIcon = Clock;

  stats = computed(() => {
    if (this.authService.isAuthenticated()) {
      const comparisons = this.changelogService.comparisons();
      const totalBreaking = comparisons.reduce((sum, c) => sum + c.summary.breakingChanges, 0);
      const avgRisk = comparisons.length > 0
        ? Math.round(comparisons.reduce((sum, c) => sum + c.summary.riskScore, 0) / comparisons.length)
        : 0;
      return {
        totalComparisons: comparisons.length,
        breakingChanges: totalBreaking,
        avgRiskScore: avgRisk,
        stabilityGrade: this.calculateOverallGrade(comparisons)
      };
    }
    // Mock data pour visiteurs
    return {
      totalComparisons: 12,
      breakingChanges: 23,
      avgRiskScore: 65,
      stabilityGrade: 'B'
    };
  });

  recentComparisons = computed(() => {
    if (this.authService.isAuthenticated()) {
      return this.changelogService.comparisons().slice(0, 5);
    }
    return this.changelogService.getMockComparisons();
  });

  private calculateOverallGrade(comparisons: ComparisonResult[]): string {
    if (comparisons.length === 0) return 'A';
    const avgScore = comparisons.reduce((sum, c) => sum + c.summary.riskScore, 0) / comparisons.length;
    if (avgScore <= 20) return 'A';
    if (avgScore <= 40) return 'B';
    if (avgScore <= 60) return 'C';
    if (avgScore <= 80) return 'D';
    return 'F';
  }
}
