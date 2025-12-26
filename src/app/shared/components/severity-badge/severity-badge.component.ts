import { Component, Input } from '@angular/core';
import { Severity } from '../../../core/models/breaking-change.model';

@Component({
  selector: 'app-severity-badge',
  standalone: true,
  template: `
    <span [class]="badgeClass">
      {{ severity }}
    </span>
  `
})
export class SeverityBadgeComponent {
  @Input() severity: Severity = 'INFO';

  get badgeClass(): string {
    const base = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (this.severity) {
      case 'BREAKING':
        return `${base} bg-red-500/20 text-red-400 border border-red-500/30`;
      case 'DANGEROUS':
        return `${base} bg-orange-500/20 text-orange-400 border border-orange-500/30`;
      case 'WARNING':
        return `${base} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
      case 'INFO':
        return `${base} bg-blue-500/20 text-blue-400 border border-blue-500/30`;
      default:
        return `${base} bg-gray-500/20 text-gray-400`;
    }
  }
}
