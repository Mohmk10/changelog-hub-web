import { Component } from '@angular/core';

@Component({
  selector: 'app-changelog',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Changelog</h1>
      <p class="text-gray-500 dark:text-dark-400">View all detected changes across your API versions.</p>
      <div class="card">
        <p class="text-gray-500 dark:text-dark-400 text-center py-8">Coming soon...</p>
      </div>
    </div>
  `
})
export class ChangelogComponent {}
