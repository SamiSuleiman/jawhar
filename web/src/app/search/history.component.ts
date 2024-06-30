import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { ProfileHistoryEntry } from '../github/github.model';
import { GITHUB_HISTORY_KEY } from '../github/github.consts';

@Component({
  template: `
    <div class="max-h-[75vh] overflow-y-scroll">
      @for (entry of $history(); track $index) {
      <div
        class="card card-side bg-base-100 cursor-pointer hover:opacity-80 transition-all"
        (click)="$chosen.emit(entry.username)"
      >
        <figure class="max-w-14">
          <img [src]="entry.avatarUrl" alt="avatar" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ entry.username }}</h2>
        </div>
      </div>
      }
    </div>
  `,
  selector: 'app-history',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent implements OnInit {
  readonly $chosen = output<string>({ alias: 'chosen' });

  readonly $history = signal<ProfileHistoryEntry[]>([]);

  ngOnInit(): void {
    const _history = JSON.parse(
      localStorage.getItem(GITHUB_HISTORY_KEY) ?? '[]'
    ) as ProfileHistoryEntry[];
    this.$history.set(_history);
  }
}
