import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ui-empty',
  imports: [MatIconModule],
  template: `
    <div class="wrapper">
      <mat-icon>inbox</mat-icon>
      <p class="title">{{ title() }}</p>
      @if (description()) {
        <p class="description">{{ description() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: [
    `
      .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 3rem 1rem;
        color: var(--mat-sys-on-surface-variant);
      }
      mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
      }
      .title {
        margin: 0;
        font: var(--mat-sys-title-medium);
      }
      .description {
        margin: 0;
        font: var(--mat-sys-body-medium);
      }
    `,
  ],
})
export class EmptyStateComponent {
  readonly title = input<string>('Nothing here yet.');
  readonly description = input<string>('');
}
