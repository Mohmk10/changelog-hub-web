import { Injectable, signal } from '@angular/core';
import { ComparisonResult, BreakingChange, ApiSpec, ComparisonSummary } from '../models/breaking-change.model';

@Injectable({
  providedIn: 'root'
})
export class ChangelogService {

  private comparisons = signal<ComparisonResult[]>([]);

  readonly comparisons$ = this.comparisons.asReadonly();

  compareSpecs(oldSpec: ApiSpec, newSpec: ApiSpec): ComparisonResult {
    // Mock comparison - sera remplacé par un appel API
    const mockChanges: BreakingChange[] = [
      {
        id: '1',
        type: 'ENDPOINT_REMOVED',
        severity: 'BREAKING',
        path: '/api/v1/users/{id}',
        description: 'DELETE endpoint removed',
        migrationGuide: 'Use /api/v2/users/{id} instead'
      },
      {
        id: '2',
        type: 'PARAMETER_ADDED',
        severity: 'BREAKING',
        path: '/api/v1/orders',
        description: 'Required parameter "customerId" added',
        newValue: 'customerId: string (required)'
      },
      {
        id: '3',
        type: 'TYPE_CHANGED',
        severity: 'DANGEROUS',
        path: '/api/v1/products/{id}',
        description: 'Response field "price" type changed',
        oldValue: 'number',
        newValue: 'string'
      },
      {
        id: '4',
        type: 'FIELD_REMOVED',
        severity: 'WARNING',
        path: '/api/v1/users',
        description: 'Response field "middleName" removed'
      }
    ];

    const summary: ComparisonSummary = {
      totalChanges: mockChanges.length,
      breakingChanges: mockChanges.filter(c => c.severity === 'BREAKING').length,
      dangerousChanges: mockChanges.filter(c => c.severity === 'DANGEROUS').length,
      warningChanges: mockChanges.filter(c => c.severity === 'WARNING').length,
      infoChanges: mockChanges.filter(c => c.severity === 'INFO').length,
      riskScore: 75,
      stabilityGrade: 'C',
      semverRecommendation: 'MAJOR'
    };

    const result: ComparisonResult = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      oldSpec,
      newSpec,
      changes: mockChanges,
      summary
    };

    this.comparisons.update(list => [result, ...list]);
    return result;
  }

  getRecentComparisons(): ComparisonResult[] {
    return this.comparisons();
  }
}
