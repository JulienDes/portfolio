import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

import { NavbarComponent } from './core/layout/navbar/navbar';
import { FooterComponent } from './core/layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [
    `
      :host {
        display: block;
      }
      main {
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Map of url → scrollY, kept in memory for the session
  private readonly scrollMap = new Map<string, number>();
  private currentUrl = '';

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationStart || e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => {
        if (e instanceof NavigationStart) {
          // Save scroll position of the page we're leaving
          if (this.currentUrl) {
            this.scrollMap.set(this.currentUrl, window.scrollY);
          }
        }

        if (e instanceof NavigationEnd) {
          this.currentUrl = e.urlAfterRedirects;
          const fragment = this.router.parseUrl(e.urlAfterRedirects).fragment;
          const saved = this.scrollMap.get(e.urlAfterRedirects);

          if (saved !== undefined) {
            // Restore saved position (back/forward navigation)
            setTimeout(() => window.scrollTo({ top: saved, behavior: 'instant' }), 0);
          } else if (!fragment) {
            // Fresh navigation to a non-fragment route — scroll to top
            window.scrollTo({ top: 0, behavior: 'instant' });
          }
          // Fragment routes with no saved position — anchorScrolling handles it
        }
      });
  }
}
