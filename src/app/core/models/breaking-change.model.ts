export interface BreakingChange {
  id: string;
  type: BreakingChangeType;
  severity: Severity;
  path: string;
  description: string;
  oldValue?: string;
  newValue?: string;
  migrationGuide?: string;
}

export type BreakingChangeType =
  | 'ENDPOINT_REMOVED'
  | 'METHOD_CHANGED'
  | 'PARAMETER_ADDED'
  | 'PARAMETER_REMOVED'
  | 'TYPE_CHANGED'
  | 'FIELD_REMOVED'
  | 'RESPONSE_CHANGED';

export type Severity = 'BREAKING' | 'DANGEROUS' | 'WARNING' | 'INFO';

export interface ComparisonResult {
  id: string;
  timestamp: Date;
  oldSpec: ApiSpec;
  newSpec: ApiSpec;
  changes: BreakingChange[];
  summary: ComparisonSummary;
}

export interface ComparisonSummary {
  totalChanges: number;
  breakingChanges: number;
  dangerousChanges: number;
  warningChanges: number;
  infoChanges: number;
  riskScore: number;
  stabilityGrade: string;
  semverRecommendation: 'MAJOR' | 'MINOR' | 'PATCH';
}

export interface ApiSpec {
  name: string;
  version: string;
  format: 'OPENAPI' | 'GRAPHQL' | 'GRPC' | 'ASYNCAPI';
  content: string;
}
