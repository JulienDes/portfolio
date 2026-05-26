import { Component, computed, effect, HostListener, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LangService } from '../../../../core/lang/lang';
import {
  Formation,
  FormationDescriptionBlock,
  FormationDescriptionList,
} from '../../models/formation';

@Component({
  selector: 'app-formation-panel',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './formation-panel.html',
  styleUrl: './formation-panel.scss',
})
export class FormationPanelComponent {
  // ── Public injectables ──
  readonly lang = inject(LangService);

  // ── Public fields ──
  readonly formation = input<Formation | null>(null);
  readonly closed = output<void>();
  readonly isOpen = computed(() => this.formation() !== null);

  // ── Constructor ──
  constructor() {
    effect(() => {
      document.body.style.overflow = this.isOpen() ? 'hidden' : '';
    });
  }

  // ── Public methods ──
  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.isOpen()) this.closed.emit();
  }

  isDescriptionList(block: unknown): block is FormationDescriptionList {
    return typeof block === 'object' && block !== null && 'list' in block;
  }

  descriptionItems(block: FormationDescriptionBlock): string[] {
    return (block as FormationDescriptionList).list;
  }
}
