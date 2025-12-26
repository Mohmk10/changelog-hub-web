import { Component, OnInit } from '@angular/core';
import { LucideAngularModule, TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-angular';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [LucideAngularModule, BaseChartDirective],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p class="text-slate-500 dark:text-dark-400 mt-1">Track trends and insights about your API changes</p>
        </div>
        <div class="flex items-center gap-2">
          <select class="input text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>All time</option>
          </select>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="stat-card">
          <div class="flex items-center justify-between mb-3">
            <span class="text-slate-500 dark:text-dark-400 text-sm font-medium">Total Changes</span>
            <div class="w-8 h-8 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center">
              <lucide-icon [img]="ActivityIcon" class="w-4 h-4 text-primary-600 dark:text-primary-400"></lucide-icon>
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ metrics.totalChanges }}</p>
          <div class="flex items-center gap-1 mt-2">
            <lucide-icon [img]="ArrowUpRightIcon" class="w-4 h-4 text-emerald-500"></lucide-icon>
            <span class="text-emerald-600 dark:text-emerald-400 text-sm font-medium">+12%</span>
            <span class="text-slate-400 dark:text-dark-500 text-sm">vs last period</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between mb-3">
            <span class="text-slate-500 dark:text-dark-400 text-sm font-medium">Breaking Rate</span>
            <div class="w-8 h-8 bg-red-100 dark:bg-red-500/20 rounded-lg flex items-center justify-center">
              <lucide-icon [img]="TrendingDownIcon" class="w-4 h-4 text-red-600 dark:text-red-400"></lucide-icon>
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ metrics.breakingRate }}%</p>
          <div class="flex items-center gap-1 mt-2">
            <lucide-icon [img]="ArrowDownRightIcon" class="w-4 h-4 text-emerald-500"></lucide-icon>
            <span class="text-emerald-600 dark:text-emerald-400 text-sm font-medium">-5%</span>
            <span class="text-slate-400 dark:text-dark-500 text-sm">improved</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between mb-3">
            <span class="text-slate-500 dark:text-dark-400 text-sm font-medium">Avg Risk Score</span>
            <div class="w-8 h-8 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex items-center justify-center">
              <lucide-icon [img]="BarChart3Icon" class="w-4 h-4 text-amber-600 dark:text-amber-400"></lucide-icon>
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ metrics.avgRiskScore }}</p>
          <div class="flex items-center gap-1 mt-2">
            <lucide-icon [img]="ArrowDownRightIcon" class="w-4 h-4 text-emerald-500"></lucide-icon>
            <span class="text-emerald-600 dark:text-emerald-400 text-sm font-medium">-8</span>
            <span class="text-slate-400 dark:text-dark-500 text-sm">points</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between mb-3">
            <span class="text-slate-500 dark:text-dark-400 text-sm font-medium">APIs Analyzed</span>
            <div class="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <lucide-icon [img]="PieChartIcon" class="w-4 h-4 text-emerald-600 dark:text-emerald-400"></lucide-icon>
            </div>
          </div>
          <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ metrics.apisAnalyzed }}</p>
          <div class="flex items-center gap-1 mt-2">
            <lucide-icon [img]="ArrowUpRightIcon" class="w-4 h-4 text-emerald-500"></lucide-icon>
            <span class="text-emerald-600 dark:text-emerald-400 text-sm font-medium">+3</span>
            <span class="text-slate-400 dark:text-dark-500 text-sm">new APIs</span>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Changes Over Time -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Changes Over Time</h3>
            <div class="flex items-center gap-4 text-sm">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="text-slate-500 dark:text-dark-400">Breaking</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span class="text-slate-500 dark:text-dark-400">Warning</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span class="text-slate-500 dark:text-dark-400">Info</span>
              </div>
            </div>
          </div>
          <div class="h-64">
            <canvas baseChart
              [data]="lineChartData"
              [options]="lineChartOptions"
              [type]="'line'">
            </canvas>
          </div>
        </div>

        <!-- Changes by Severity -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Changes by Severity</h3>
          </div>
          <div class="h-64 flex items-center justify-center">
            <canvas baseChart
              [data]="doughnutChartData"
              [options]="doughnutChartOptions"
              [type]="'doughnut'">
            </canvas>
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Top Breaking Endpoints -->
        <div class="card lg:col-span-2">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Most Affected Endpoints</h3>
          <div class="space-y-3">
            @for (endpoint of topEndpoints; track endpoint.path) {
              <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-dark-700 rounded-lg">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full"
                       [class]="endpoint.severity === 'high' ? 'bg-red-500' : endpoint.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'">
                  </div>
                  <span class="font-mono text-sm text-slate-700 dark:text-dark-200">{{ endpoint.path }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-500 dark:text-dark-400 text-sm">{{ endpoint.changes }} changes</span>
                  <div class="w-24 h-2 bg-slate-200 dark:bg-dark-600 rounded-full overflow-hidden">
                    <div class="h-full rounded-full"
                         [class]="endpoint.severity === 'high' ? 'bg-red-500' : endpoint.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'"
                         [style.width.%]="endpoint.percentage">
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Stability Trend -->
        <div class="card">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Stability Grade History</h3>
          <div class="space-y-4">
            @for (grade of stabilityHistory; track grade.date) {
              <div class="flex items-center justify-between">
                <span class="text-slate-500 dark:text-dark-400 text-sm">{{ grade.date }}</span>
                <div class="flex items-center gap-2">
                  <span class="text-2xl font-bold"
                        [class]="grade.grade === 'A' ? 'text-emerald-500' :
                                 grade.grade === 'B' ? 'text-blue-500' :
                                 grade.grade === 'C' ? 'text-amber-500' : 'text-red-500'">
                    {{ grade.grade }}
                  </span>
                  @if (grade.trend === 'up') {
                    <lucide-icon [img]="TrendingUpIcon" class="w-4 h-4 text-emerald-500"></lucide-icon>
                  } @else if (grade.trend === 'down') {
                    <lucide-icon [img]="TrendingDownIcon" class="w-4 h-4 text-red-500"></lucide-icon>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  TrendingUpIcon = TrendingUp;
  TrendingDownIcon = TrendingDown;
  BarChart3Icon = BarChart3;
  PieChartIcon = PieChart;
  ActivityIcon = Activity;
  CalendarIcon = Calendar;
  ArrowUpRightIcon = ArrowUpRight;
  ArrowDownRightIcon = ArrowDownRight;

  metrics = {
    totalChanges: 156,
    breakingRate: 18,
    avgRiskScore: 62,
    apisAnalyzed: 8
  };

  topEndpoints = [
    { path: '/api/v1/users', changes: 12, severity: 'high', percentage: 100 },
    { path: '/api/v1/orders', changes: 8, severity: 'high', percentage: 67 },
    { path: '/api/v1/products', changes: 6, severity: 'medium', percentage: 50 },
    { path: '/api/v1/auth', changes: 4, severity: 'medium', percentage: 33 },
    { path: '/api/v1/settings', changes: 2, severity: 'low', percentage: 17 },
  ];

  stabilityHistory = [
    { date: 'Dec 2025', grade: 'B', trend: 'up' },
    { date: 'Nov 2025', grade: 'C', trend: 'up' },
    { date: 'Oct 2025', grade: 'C', trend: 'down' },
    { date: 'Sep 2025', grade: 'B', trend: 'stable' },
  ];

  lineChartData: ChartData<'line'> = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        data: [12, 8, 15, 10, 6, 9],
        label: 'Breaking',
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        data: [5, 10, 8, 12, 9, 7],
        label: 'Warning',
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        data: [8, 6, 10, 5, 12, 8],
        label: 'Info',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' }
      },
      y: {
        grid: { color: 'rgba(100, 116, 139, 0.1)' },
        ticks: { color: '#64748b' }
      }
    }
  };

  doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Breaking', 'Dangerous', 'Warning', 'Info'],
    datasets: [{
      data: [23, 15, 42, 76],
      backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#3b82f6'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#64748b', padding: 20 }
      }
    },
    cutout: '60%'
  };

  ngOnInit() {}
}
