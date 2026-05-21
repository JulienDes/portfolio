import { Component, computed, effect, HostListener, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LangService } from '../../../../core/lang/lang';
import { Project } from '../../models/project';

@Component({
  selector: 'app-project-panel',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './project-panel.html',
  styleUrl: './project-panel.scss',
})
export class ProjectPanelComponent {
  // ── Public injectables ────────────────────────────────────────────────────
  readonly lang = inject(LangService);

  // ── Public fields ─────────────────────────────────────────────────────────
  readonly project = input<Project | null>(null);
  readonly closed = output<void>();
  readonly isOpen = computed(() => this.project() !== null);

  constructor() {
    effect(() => {
      document.body.style.overflow = this.isOpen() ? 'hidden' : '';
    });
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.isOpen()) this.closed.emit();
  }
}
