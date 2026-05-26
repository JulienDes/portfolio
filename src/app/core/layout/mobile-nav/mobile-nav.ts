import { Component, inject, output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LangService } from '../../lang/lang';

interface NavItem {
  index: string;
  labelEn: string;
  labelFr: string;
  fragment: string;
}

@Component({
  selector: 'app-mobile-nav',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './mobile-nav.html',
  styleUrl: './mobile-nav.scss',
  animations: [
    trigger('overlay', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px)' }),
        animate('200ms cubic-bezier(0.2, 0.7, 0.2, 1)', style({ opacity: 1, transform: 'none' })),
      ]),
      transition(':leave', [
        animate(
          '160ms cubic-bezier(0.4, 0, 1, 1)',
          style({ opacity: 0, transform: 'translateY(-8px)' }),
        ),
      ]),
    ]),
  ],
})
export class MobileNavComponent {
  private readonly router = inject(Router);
  readonly lang = inject(LangService);

  /** Emitted when the user navigates or closes the overlay */
  readonly closed = output<void>();

  readonly navItems: NavItem[] = [
    { index: '01', labelEn: 'Educations', labelFr: 'Formations', fragment: 'education' },
    { index: '02', labelEn: 'Projects', labelFr: 'Projets', fragment: 'projects' },
    { index: '03', labelEn: 'Journal', labelFr: 'Journal', fragment: 'journal' },
    { index: '04', labelEn: 'Contact', labelFr: 'Contact', fragment: 'contact' },
  ];

  navigate(fragment: string): void {
    const el = document.getElementById(fragment);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      this.router.navigate(['/'], { fragment });
    }
    this.closed.emit();
  }

  close(): void {
    this.closed.emit();
  }
}
