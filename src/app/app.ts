import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="min-h-screen bg-dark-950">
      <app-sidebar></app-sidebar>
      <main class="ml-64 p-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class App {}
