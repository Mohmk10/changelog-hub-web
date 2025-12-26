import { Component, inject, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Filter, Download, Calendar, ChevronDown, FileJson } from 'lucide-angular';
import { ChangelogService } from '../../core/services/changelog.service';
import { SeverityBadgeComponent } from '../../shared/components/severity-badge/severity-badge.component';

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [DatePipe, FormsModule, LucideAngularModule, SeverityBadgeComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Changelog</h1>
          <p class="text-slate-500 dark:text-dark-400 mt-1">History of all detected API changes</p>
        </div>
        <button class="btn-secondary flex items-center gap-2">
          <lucide-icon [img]="DownloadIcon" class="w-4 h-4"></lucide-icon>
          Export
        </button>
      </div>

      <!-- Filters -->
      <div class="card">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Search -->
          <div class="relative flex-1 min-w-64">
            <lucide-icon [img]="SearchIcon" class="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></lucide-icon>
            <input
              type="text"
              placeholder="Search changes..."
              class="input w-full pl-10"
              [(ngModel)]="searchQuery"
            >
          </div>

          <!-- Severity Filter -->
          <div class="relative">
            <select class="input pr-10 appearance-none cursor-pointer" [(ngModel)]="selectedSeverity">
              <option value="all">All Severities</option>
              <option value="BREAKING">Breaking</option>
              <option value="DANGEROUS">Dangerous</option>
              <option value="WARNING">Warning</option>
              <option value="INFO">Info</option>
            </select>
            <lucide-icon [img]="ChevronDownIcon" class="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"></lucide-icon>
          </div>

          <!-- Date Filter -->
          <div class="relative">
            <select class="input pr-10 appearance-none cursor-pointer" [(ngModel)]="dateRange">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <lucide-icon [img]="ChevronDownIcon" class="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"></lucide-icon>
          </div>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ breakingCount() }}</p>
          <p class="text-red-600/70 dark:text-red-400/70 text-sm">Breaking</p>
        </div>
        <div class="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ dangerousCount() }}</p>
          <p class="text-orange-600/70 dark:text-orange-400/70 text-sm">Dangerous</p>
        </div>
        <div class="bg-amber-50 dark:bg-yellow-500/10 border border-amber-200 dark:border-yellow-500/30 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-amber-600 dark:text-yellow-400">{{ warningCount() }}</p>
          <p class="text-amber-600/70 dark:text-yellow-400/70 text-sm">Warning</p>
        </div>
        <div class="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ infoCount() }}</p>
          <p class="text-blue-600/70 dark:text-blue-400/70 text-sm">Info</p>
        </div>
      </div>

      <!-- Changelog List -->
      <div class="space-y-4">
        @if (comparisons().length === 0) {
          <div class="card text-center py-12">
            <div class="w-16 h-16 bg-slate-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <lucide-icon [img]="FileJsonIcon" class="w-8 h-8 text-slate-400 dark:text-dark-400"></lucide-icon>
            </div>
            <p class="text-slate-500 dark:text-dark-400 font-medium">No changes recorded yet</p>
            <p class="text-slate-400 dark:text-dark-500 text-sm mt-1">Compare API specs to see changes here</p>
          </div>
        } @else {
          @for (comparison of filteredComparisons(); track comparison.id) {
            <div class="card">
              <!-- Comparison Header -->
              <div class="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-dark-700">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <lucide-icon [img]="CalendarIcon" class="w-5 h-5 text-primary-600 dark:text-primary-400"></lucide-icon>
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900 dark:text-white">{{ comparison.oldSpec.name }} &rarr; {{ comparison.newSpec.name }}</p>
                    <p class="text-slate-500 dark:text-dark-400 text-sm">{{ comparison.timestamp | date:'MMMM d, y - h:mm a' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 bg-slate-100 dark:bg-dark-700 rounded-lg text-sm font-medium text-slate-600 dark:text-dark-300">
                    {{ comparison.changes.length }} changes
                  </span>
                  <span class="px-3 py-1 rounded-lg text-sm font-medium"
                        [class]="comparison.summary.riskScore >= 70 ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' :
                                 comparison.summary.riskScore >= 40 ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                                 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'">
                    Risk: {{ comparison.summary.riskScore }}
                  </span>
                </div>
              </div>

              <!-- Changes List -->
              <div class="space-y-3">
                @for (change of comparison.changes; track change.id) {
                  <div class="p-4 bg-slate-50 dark:bg-dark-700 rounded-lg">
                    <div class="flex items-start gap-3">
                      <app-severity-badge [severity]="change.severity"></app-severity-badge>
                      <div class="flex-1">
                        <p class="text-slate-900 dark:text-white font-medium">{{ change.description }}</p>
                        <p class="text-slate-500 dark:text-dark-400 text-sm font-mono mt-1">{{ change.path }}</p>

                        @if (change.oldValue || change.newValue) {
                          <div class="mt-3 p-3 bg-slate-100 dark:bg-dark-800 rounded-lg font-mono text-sm">
                            @if (change.oldValue) {
                              <p class="text-red-600 dark:text-red-400">- {{ change.oldValue }}</p>
                            }
                            @if (change.newValue) {
                              <p class="text-emerald-600 dark:text-green-400">+ {{ change.newValue }}</p>
                            }
                          </div>
                        }

                        @if (change.migrationGuide) {
                          <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg">
                            <p class="text-blue-700 dark:text-blue-300 text-sm">
                              <span class="font-semibold">&#128161; Migration:</span> {{ change.migrationGuide }}
                            </p>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class ChangelogComponent {
  private changelogService = inject(ChangelogService);

  SearchIcon = Search;
  FilterIcon = Filter;
  DownloadIcon = Download;
  CalendarIcon = Calendar;
  ChevronDownIcon = ChevronDown;
  FileJsonIcon = FileJson;

  searchQuery = '';
  selectedSeverity = 'all';
  dateRange = 'all';

  comparisons = this.changelogService.comparisons$;

  filteredComparisons = computed(() => {
    let results = this.comparisons();

    if (this.selectedSeverity !== 'all') {
      results = results.map(c => ({
        ...c,
        changes: c.changes.filter(change => change.severity === this.selectedSeverity)
      })).filter(c => c.changes.length > 0);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      results = results.map(c => ({
        ...c,
        changes: c.changes.filter(change =>
          change.description.toLowerCase().includes(query) ||
          change.path.toLowerCase().includes(query)
        )
      })).filter(c => c.changes.length > 0);
    }

    return results;
  });

  breakingCount = computed(() =>
    this.comparisons().reduce((sum, c) => sum + c.summary.breakingChanges, 0)
  );

  dangerousCount = computed(() =>
    this.comparisons().reduce((sum, c) => sum + c.summary.dangerousChanges, 0)
  );

  warningCount = computed(() =>
    this.comparisons().reduce((sum, c) => sum + c.summary.warningChanges, 0)
  );

  infoCount = computed(() =>
    this.comparisons().reduce((sum, c) => sum + c.summary.infoChanges, 0)
  );
}
