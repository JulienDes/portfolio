import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ui-error',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="wrapper">
      <mat-icon>error_outline</mat-icon>
      <p>{{ message() }}</p>
      @if (retryable()) {
        <button mat-stroked-button (click)="retry.emit()">Retry</button>
      }
    </div>
  `,
  styles: [
    `
      .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 2rem;
        color: var(--mat-sys-error);
      }
      mat-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
      }
      p {
        margin: 0;
      }
    `,
  ],
})
export class ErrorStateComponent {
  readonly message = input<string>('Something went wrong.');
  readonly retryable = input<boolean>(true);
  readonly retry = output<void>();
}
