import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { ProfileHistoryEntry } from '../github/github.model';
import { GITHUB_HISTORY_KEY } from '../github/github.consts';
import { clickable } from '../ui/classes';
import { NgClass } from '@angular/common';
import { CloseIconComponent } from '../ui/icons/close-icon.component';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  template: `
    <ng-container *transloco="let t">
      <div class="max-h-[75vh] overflow-y-scroll">
        @for (entry of $history(); track $index) {
          <div class="card card-side bg-base-100">
            <figure
              class="max-w-14"
              [ngClass]="clickable"
              (click)="$chosen.emit(entry.username)"
            >
              <img [src]="entry.avatarUrl" [alt]="t('images.alts.avatar')" />
            </figure>
            <div class="card-body">
              <h2 class="card-title flex justify-between">
                <span>
                  {{ entry.username }}
                </span>
                <app-close-icon
                  (click)="onEntryRemove(entry.username)"
                  [ngClass]="clickable"
                ></app-close-icon>
              </h2>
            </div>
          </div>
        }
      </div>
    </ng-container>
  `,
  imports: [NgClass, CloseIconComponent, TranslocoDirective],
  selector: 'app-history',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent implements OnInit {
  protected readonly $chosen = output<string>({ alias: 'chosen' });

  protected readonly $history = signal<ProfileHistoryEntry[]>([]);

  protected readonly clickable = clickable;

  ngOnInit(): void {
    const _history = this.getHistory();
    this.$history.set(_history);
  }

  protected onEntryRemove(username: string): void {
    const _history = this.getHistory().filter(
      (entry) => entry.username !== username,
    );
    localStorage.setItem(GITHUB_HISTORY_KEY, JSON.stringify(_history));
    this.$history.set(_history);
  }

  private getHistory() {
    return JSON.parse(
      localStorage.getItem(GITHUB_HISTORY_KEY) ?? '[]',
    ) as ProfileHistoryEntry[];
  }
}
