import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LangService } from '../../core/lang/lang';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.scss',
})
export class NotFoundPageComponent {
  // ── Public fields ─────────────────────────────────────────────────────────
  readonly lang = inject(LangService);
}
