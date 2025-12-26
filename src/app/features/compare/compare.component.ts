import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Upload, FileJson, ArrowRight, AlertCircle } from 'lucide-angular';
import { ChangelogService } from '../../core/services/changelog.service';
import { ApiSpec, ComparisonResult } from '../../core/models/breaking-change.model';
import { SeverityBadgeComponent } from '../../shared/components/severity-badge/severity-badge.component';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, SeverityBadgeComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Compare API Specifications</h1>
        <p class="text-dark-400 mt-1">Upload two API specs to detect breaking changes</p>
      </div>

      <!-- Upload Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Old Spec -->
        <div class="card">
          <h3 class="text-lg font-medium text-white mb-4">Old Specification</h3>
          <div
            class="border-2 border-dashed border-dark-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
            (click)="oldFileInput.click()"
            (dragover)="onDragOver($event)"
            (drop)="onDrop($event, 'old')"
          >
            <input
              #oldFileInput
              type="file"
              class="hidden"
              accept=".yaml,.yml,.json,.graphql,.proto"
              (change)="onFileSelected($event, 'old')"
            >
            @if (oldSpec()) {
              <lucide-icon [img]="FileJsonIcon" class="w-12 h-12 text-green-400 mx-auto mb-3"></lucide-icon>
              <p class="text-white font-medium">{{ oldSpec()!.name }}</p>
              <p class="text-dark-400 text-sm">{{ oldSpec()!.format }}</p>
            } @else {
              <lucide-icon [img]="UploadIcon" class="w-12 h-12 text-dark-400 mx-auto mb-3"></lucide-icon>
              <p class="text-dark-300">Drop file here or click to upload</p>
              <p class="text-dark-500 text-sm mt-1">Supports OpenAPI, GraphQL, Protobuf, AsyncAPI</p>
            }
          </div>
        </div>

        <!-- New Spec -->
        <div class="card">
          <h3 class="text-lg font-medium text-white mb-4">New Specification</h3>
          <div
            class="border-2 border-dashed border-dark-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
            (click)="newFileInput.click()"
            (dragover)="onDragOver($event)"
            (drop)="onDrop($event, 'new')"
          >
            <input
              #newFileInput
              type="file"
              class="hidden"
              accept=".yaml,.yml,.json,.graphql,.proto"
              (change)="onFileSelected($event, 'new')"
            >
            @if (newSpec()) {
              <lucide-icon [img]="FileJsonIcon" class="w-12 h-12 text-green-400 mx-auto mb-3"></lucide-icon>
              <p class="text-white font-medium">{{ newSpec()!.name }}</p>
              <p class="text-dark-400 text-sm">{{ newSpec()!.format }}</p>
            } @else {
              <lucide-icon [img]="UploadIcon" class="w-12 h-12 text-dark-400 mx-auto mb-3"></lucide-icon>
              <p class="text-dark-300">Drop file here or click to upload</p>
              <p class="text-dark-500 text-sm mt-1">Supports OpenAPI, GraphQL, Protobuf, AsyncAPI</p>
            }
          </div>
        </div>
      </div>

      <!-- Compare Button -->
      <div class="flex justify-center">
        <button
          class="btn-primary flex items-center gap-2 px-8 py-3"
          [disabled]="!canCompare()"
          [class.opacity-50]="!canCompare()"
          (click)="compare()"
        >
          Compare Specifications
          <lucide-icon [img]="ArrowRightIcon" class="w-5 h-5"></lucide-icon>
        </button>
      </div>

      <!-- Results -->
      @if (result()) {
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-white">Comparison Results</h2>
            <div class="flex items-center gap-4">
              <span class="px-3 py-1 bg-dark-700 rounded-lg">
                Risk Score: <span class="text-yellow-400 font-bold">{{ result()!.summary.riskScore }}</span>
              </span>
              <span class="px-3 py-1 bg-dark-700 rounded-lg">
                Grade: <span class="text-primary-400 font-bold">{{ result()!.summary.stabilityGrade }}</span>
              </span>
              <span class="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg">
                Recommended: {{ result()!.summary.semverRecommendation }}
              </span>
            </div>
          </div>

          <!-- Summary Stats -->
          <div class="grid grid-cols-4 gap-4 mb-6">
            <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
              <p class="text-3xl font-bold text-red-400">{{ result()!.summary.breakingChanges }}</p>
              <p class="text-dark-400 text-sm">Breaking</p>
            </div>
            <div class="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-center">
              <p class="text-3xl font-bold text-orange-400">{{ result()!.summary.dangerousChanges }}</p>
              <p class="text-dark-400 text-sm">Dangerous</p>
            </div>
            <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
              <p class="text-3xl font-bold text-yellow-400">{{ result()!.summary.warningChanges }}</p>
              <p class="text-dark-400 text-sm">Warning</p>
            </div>
            <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
              <p class="text-3xl font-bold text-blue-400">{{ result()!.summary.infoChanges }}</p>
              <p class="text-dark-400 text-sm">Info</p>
            </div>
          </div>

          <!-- Changes List -->
          <div class="space-y-3">
            @for (change of result()!.changes; track change.id) {
              <div class="bg-dark-700 rounded-lg p-4">
                <div class="flex items-start justify-between">
                  <div class="flex items-start gap-3">
                    <app-severity-badge [severity]="change.severity"></app-severity-badge>
                    <div>
                      <p class="text-white font-medium">{{ change.description }}</p>
                      <p class="text-dark-400 text-sm font-mono mt-1">{{ change.path }}</p>
                      @if (change.oldValue || change.newValue) {
                        <div class="mt-2 text-sm">
                          @if (change.oldValue) {
                            <p class="text-red-400">- {{ change.oldValue }}</p>
                          }
                          @if (change.newValue) {
                            <p class="text-green-400">+ {{ change.newValue }}</p>
                          }
                        </div>
                      }
                      @if (change.migrationGuide) {
                        <div class="mt-2 p-2 bg-dark-600 rounded text-sm">
                          <p class="text-dark-300">&#128161; {{ change.migrationGuide }}</p>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class CompareComponent {
  private changelogService = inject(ChangelogService);

  UploadIcon = Upload;
  FileJsonIcon = FileJson;
  ArrowRightIcon = ArrowRight;
  AlertCircleIcon = AlertCircle;

  oldSpec = signal<ApiSpec | null>(null);
  newSpec = signal<ApiSpec | null>(null);
  result = signal<ComparisonResult | null>(null);

  canCompare(): boolean {
    return this.oldSpec() !== null && this.newSpec() !== null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, type: 'old' | 'new'): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.processFile(file, type);
    }
  }

  onFileSelected(event: Event, type: 'old' | 'new'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.processFile(file, type);
    }
  }

  private processFile(file: File, type: 'old' | 'new'): void {
    const reader = new FileReader();
    reader.onload = () => {
      const spec: ApiSpec = {
        name: file.name,
        version: '1.0.0',
        format: this.detectFormat(file.name),
        content: reader.result as string
      };

      if (type === 'old') {
        this.oldSpec.set(spec);
      } else {
        this.newSpec.set(spec);
      }
    };
    reader.readAsText(file);
  }

  private detectFormat(filename: string): ApiSpec['format'] {
    if (filename.endsWith('.graphql')) return 'GRAPHQL';
    if (filename.endsWith('.proto')) return 'GRPC';
    return 'OPENAPI';
  }

  compare(): void {
    if (this.oldSpec() && this.newSpec()) {
      const comparisonResult = this.changelogService.compareSpecs(this.oldSpec()!, this.newSpec()!);
      this.result.set(comparisonResult);
    }
  }
}
