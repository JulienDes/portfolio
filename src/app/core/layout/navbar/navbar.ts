import { Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { ThemeService, PALETTES } from '../../theme/theme';
import { LangService } from '../../lang/lang';
import { MobileNavComponent } from '../mobile-nav/mobile-nav';

interface NavItem {
  index: string;
  labelEn: string;
  labelFr: string;
  fragment: string;
}

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MobileNavComponent,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent implements OnInit {
  // ── Private injectables (must precede public fields per member-ordering) ──
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);

  // ── Public injectables ────────────────────────────────────────────────────
  readonly theme = inject(ThemeService);
  readonly lang = inject(LangService);
  readonly palettes = PALETTES;

  // ── Public fields ─────────────────────────────────────────────────────────
  readonly mobileNavOpen = signal(false);

  /** Active section fragment, updated by scroll-spy */
  readonly activeFragment = signal<string>('');

  readonly navItems: NavItem[] = [
    { index: '01', labelEn: 'Educations', labelFr: 'Formations', fragment: 'education' },
    { index: '02', labelEn: 'Projects', labelFr: 'Projets', fragment: 'projects' },
    { index: '03', labelEn: 'Journal', labelFr: 'Journal', fragment: 'journal' },
    { index: '04', labelEn: 'Contact', labelFr: 'Contact', fragment: 'contact' },
  ];

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    fromEvent(window, 'scroll', { passive: true })
      .pipe(throttleTime(50), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateActiveSection());

    this.updateActiveSection();
  }

  // ── Public methods ────────────────────────────────────────────────────────
  scrollTo(fragment: string): void {
    const el = document.getElementById(fragment);
    if (el) {
      const offset = 96; // sticky navbar height
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      // Not on home page — navigate home; app.ts NavigationEnd handler will scroll
      this.router.navigate(['/'], { fragment });
    }
  }

  isActive(fragment: string): boolean {
    return this.activeFragment() === fragment;
  }

  openMobileNav(): void {
    this.mobileNavOpen.set(true);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }

  // ── Private methods ───────────────────────────────────────────────────────
  private updateActiveSection(): void {
    const scrollY = window.scrollY;
    const viewportH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    const triggerY = scrollY + 120;

    // At the very bottom of the page — activate the last nav item
    // Only snap if the last section is actually in the DOM and visible
    const lastItem = this.navItems[this.navItems.length - 1];
    const lastEl = lastItem ? document.getElementById(lastItem.fragment) : null;
    if (lastEl && scrollY + viewportH >= docH - lastEl.offsetHeight / 2) {
      this.activeFragment.set(lastItem!.fragment);
      this.syncUrlFragment(lastItem!.fragment);
      return;
    }

    let active = '';
    this.navItems.forEach((item) => {
      const el = document.getElementById(item.fragment);
      if (!el) return;
      if (el.offsetTop <= triggerY) {
        active = item.fragment;
      }
    });
    this.activeFragment.set(active);
    this.syncUrlFragment(active);
  }

  private syncUrlFragment(fragment: string): void {
    const current = this.location.path(true); // includes fragment
    const base = this.location.path(false); // path only, no fragment
    const currentFragment = current.includes('#') ? current.split('#')[1] : '';
    if (fragment === currentFragment) return;
    const newUrl = fragment ? `${base}#${fragment}` : base;
    this.location.replaceState(newUrl);
  }
}
