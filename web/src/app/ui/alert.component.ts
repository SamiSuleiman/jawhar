import { Component, inject } from '@angular/core';
import { UiService } from './ui.service';

@Component({
  template: `
    @if (uiService.$alert(); as alert) {
      <div role="alert" class="alert alert-{{ alert.type }}">
        @switch (alert.type) {
          @case ('success') {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          @case ('error') {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          @case ('info') {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="h-6 w-6 shrink-0 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          }
        }

        <span>{{ alert.message }}</span>
        <div>
          <button
            class="btn btn-sm bg-transparent border-none"
            (click)="uiService.dismissAlert()"
          >
            Dismiss
          </button>
        </div>
      </div>
    }
  `,
  selector: 'app-alert',
  standalone: true,
})
export class AlertComponent {
  protected readonly uiService = inject(UiService);
}
