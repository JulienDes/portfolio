import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { ThemeService, PALETTES } from '../../theme/theme';
import { LangService } from '../../lang/lang';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  // ── Public injectables ────────────────────────────────────────────────────
  readonly theme = inject(ThemeService);
  readonly lang = inject(LangService);
  readonly palettes = PALETTES;

  paletteName(name: string): string {
    return name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
