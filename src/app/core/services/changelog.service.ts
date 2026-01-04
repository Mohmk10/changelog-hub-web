import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { ComparisonResult, ComparisonSummary, BreakingChange, Severity, BreakingChangeType } from '../models/breaking-change.model';

@Injectable({
  providedIn: 'root'
})
export class ChangelogService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private comparisonsSignal = signal<ComparisonResult[]>([]);
  private loadingSignal = signal<boolean>(false);

  comparisons = this.comparisonsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  constructor() {
    this.authService.isAuthenticated() && this.loadComparisons();
  }

  loadComparisons(): void {
    if (!this.authService.isAuthenticated()) return;

    this.loadingSignal.set(true);
    this.http.get<ComparisonResult[]>(`${environment.apiUrl}/api/comparisons`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (comparisons) => {
        this.comparisonsSignal.set(comparisons);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.loadingSignal.set(false);
      }
    });
  }

  compareSpecs(oldFile: File, newFile: File): Promise<ComparisonResult> {
    const formData = new FormData();
    formData.append('oldSpec', oldFile);
    formData.append('newSpec', newFile);

    const endpoint = this.authService.isAuthenticated()
      ? '/api/comparisons'
      : '/api/comparisons/anonymous';

    return new Promise((resolve, reject) => {
      this.http.post<ComparisonResult>(`${environment.apiUrl}${endpoint}`, formData, {
        headers: this.authService.getAuthHeaders()
      }).subscribe({
        next: (result) => {
          if (this.authService.isAuthenticated()) {
            this.comparisonsSignal.update(comparisons => [result, ...comparisons]);
          }
          resolve(result);
        },
        error: (error) => reject(error)
      });
    });
  }

  deleteComparison(id: string): void {
    if (!this.authService.isAuthenticated()) return;

    this.http.delete(`${environment.apiUrl}/api/comparisons/${id}`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: () => {
        this.comparisonsSignal.update(comparisons =>
          comparisons.filter(c => c.id !== id)
        );
      }
    });
  }

  getMockComparisons(): ComparisonResult[] {
    return [
      {
        id: 'mock-1',
        timestamp: new Date('2025-12-20'),
        oldSpec: { name: 'api-v1.yaml', format: 'OPENAPI', version: '1.0.0', content: '' },
        newSpec: { name: 'api-v2.yaml', format: 'OPENAPI', version: '2.0.0', content: '' },
        changes: this.getMockChanges(),
        summary: { totalChanges: 4, breakingChanges: 1, dangerousChanges: 1, warningChanges: 1, infoChanges: 1, riskScore: 75, stabilityGrade: 'C', semverRecommendation: 'MAJOR' }
      },
      {
        id: 'mock-2',
        timestamp: new Date('2025-12-18'),
        oldSpec: { name: 'schema-v2.graphql', format: 'GRAPHQL', version: '2.0.0', content: '' },
        newSpec: { name: 'schema-v3.graphql', format: 'GRAPHQL', version: '3.0.0', content: '' },
        changes: this.getMockChanges().slice(0, 2),
        summary: { totalChanges: 2, breakingChanges: 1, dangerousChanges: 0, warningChanges: 1, infoChanges: 0, riskScore: 60, stabilityGrade: 'B', semverRecommendation: 'MAJOR' }
      }
    ];
  }

  getMockChanges(): BreakingChange[] {
    return [
      { id: '1', type: 'ENDPOINT_REMOVED' as BreakingChangeType, severity: 'BREAKING' as Severity, path: '/api/v1/users/{id}', description: 'Endpoint has been removed', oldValue: 'GET /api/v1/users/{id}', newValue: undefined, migrationGuide: 'Use GET /api/v2/users/{id} instead' },
      { id: '2', type: 'PARAMETER_ADDED' as BreakingChangeType, severity: 'DANGEROUS' as Severity, path: '/api/v1/orders', description: 'Required parameter added', oldValue: undefined, newValue: 'customerId (required)', migrationGuide: 'Include customerId in all requests' },
      { id: '3', type: 'TYPE_CHANGED' as BreakingChangeType, severity: 'WARNING' as Severity, path: '/api/v1/products', description: 'Response type changed', oldValue: 'price: number', newValue: 'price: string', migrationGuide: 'Update client to handle string prices' },
      { id: '4', type: 'FIELD_REMOVED' as BreakingChangeType, severity: 'INFO' as Severity, path: '/api/v1/settings', description: 'Deprecated field removed', oldValue: 'legacyMode: boolean', newValue: undefined, migrationGuide: 'Field was deprecated, no action needed' }
    ];
  }

  getMockSummary(): ComparisonSummary {
    return { totalChanges: 4, breakingChanges: 1, dangerousChanges: 1, warningChanges: 1, infoChanges: 1, riskScore: 75, stabilityGrade: 'C', semverRecommendation: 'MAJOR' };
  }
}
