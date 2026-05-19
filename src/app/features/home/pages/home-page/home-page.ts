import { Component, ElementRef, inject, viewChild } from '@angular/core';

import { LangService } from '../../../../core/lang/lang';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePageComponent {
  // ── Private fields ────────────────────────────────────────────────────────
  private readonly copyToastEl = viewChild<ElementRef<HTMLSpanElement>>('copyToast');
  private copyTimeout: ReturnType<typeof setTimeout> | null = null;

  // ── Public fields ─────────────────────────────────────────────────────────
  readonly lang = inject(LangService);

  // ── Contact ───────────────────────────────────────────────────────────────
  emailCopied = false;

  // ── Methods ────────────────────────────────────────────────────────────────

  copyEmail(): void {
    // Copy to clipboard — fire and forget, don't gate the UI on the promise
    navigator.clipboard.writeText('julien.desrosiers+portfolio@uqtr.ca').catch(() => null);

    // Update button label
    this.emailCopied = true;
    if (this.copyTimeout) clearTimeout(this.copyTimeout);
    this.copyTimeout = setTimeout(() => (this.emailCopied = false), 2000);

    // Restart toast animation imperatively — no Angular binding involved
    const el = this.copyToastEl()?.nativeElement;
    if (el) {
      el.classList.remove('copy-toast--visible');
      void el.offsetWidth; // force reflow so browser registers the class removal
      el.classList.add('copy-toast--visible');
    }
  }
}
