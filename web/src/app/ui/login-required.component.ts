import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';

@Component({
  template: `
    <dialog #modal class="modal" [ngClass]="[$isOpen() ? '' : 'hidden']">
      <div class="modal-box">
        <h3 class="text-lg font-bold">You need to log in!</h3>
        <button class="btn" (click)="$login.emit()">Login</button>
      </div>
    </dialog>
  `,
  imports: [NgClass],
  selector: 'app-login-required',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginRequiredComponent {
  $isOpen = input.required<boolean>();
  $login = output<void>();

  $dialog = viewChild.required<any>('modal');

  constructor() {
    effect(() => {
      const _dialog = this.$dialog();

      if (this.$isOpen()) _dialog.nativeElement.showModal();
      else _dialog.nativeElement.close();
    });
  }

  @HostListener('keydown.escape', ['$event'])
  onKeydown(event: KeyboardEvent) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
}
