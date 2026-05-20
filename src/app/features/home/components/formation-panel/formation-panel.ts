import { Component, computed, effect, HostListener, inject, input, output } from '@angular/core';

import { LangService } from '../../../../core/lang/lang';
import { Formation } from '../../models/formation';

@Component({
  selector: 'app-formation-panel',
  imports: [],
  templateUrl: './formation-panel.html',
  styleUrl: './formation-panel.scss',
})
export class FormationPanelComponent {
  readonly lang = inject(LangService);
  readonly formation = input<Formation | null>(null);
  readonly closed = output<void>();

  readonly isOpen = computed(() => this.formation() !== null);

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
