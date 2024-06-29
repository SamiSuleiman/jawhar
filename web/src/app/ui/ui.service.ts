import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  readonly $isLoading = signal(false);
  readonly $alert = signal<
    | {
        message: string;
        type: 'error' | 'info' | 'success';
      }
    | undefined
  >(undefined);

  setAlert(message: string, type: 'error' | 'info' | 'success'): void {
    this.$alert.set({ message, type });
  }

  dismissAlert(): void {
    this.$alert.set(undefined);
  }
}
