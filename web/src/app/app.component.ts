import { Component, Renderer2, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './ui/alert.component';
import { TranslocoService } from '@jsverse/transloco';
import { ACTIVE_LANG_KEY } from './app.consts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, tap } from 'rxjs';

@Component({
  template: `
    <router-outlet></router-outlet>
    <div class="absolute bottom-0 left-0 w-full">
      <app-alert></app-alert>
    </div>
  `,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertComponent],
})
export class AppComponent {
  private readonly translocoService = inject(TranslocoService);
  private readonly renderer2 = inject(Renderer2);

  constructor() {
    this.translocoService.setDefaultLang('en');
    const activeLang = localStorage.getItem(ACTIVE_LANG_KEY);
    this.translocoService.setActiveLang(activeLang ?? 'en');
    this.switchDirection(activeLang ?? 'en');
    this.translocoService.events$
      .pipe(
        filter((e) => e.type === 'langChanged'),
        map((e) => e.payload),
        tap(({ langName }) => this.switchDirection(langName)),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  switchDirection(lang: string): void {
    if (lang === 'ar') this.renderer2.setAttribute(document.body, 'dir', 'rtl');
    else this.renderer2.setAttribute(document.body, 'dir', 'ltr');
  }
}
