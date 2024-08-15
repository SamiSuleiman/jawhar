import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private readonly router = inject(Router);

  goto(route: string, user?: string): void {
    if (route === '') this.router.navigate(['/']);
    else {
      if (!user) return;
      this.router.navigate([`/${route}/${user}`]);
    }
  }

  isDisabled(route: string, user?: string): boolean {
    if (route === '') return false;
    return !user;
  }
}
