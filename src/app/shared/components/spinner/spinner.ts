import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'ui-spinner',
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="wrapper">
      <mat-spinner [diameter]="diameter()" />
    </div>
  `,
  styles: [
    `
      .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
      }
    `,
  ],
})
export class SpinnerComponent {
  readonly diameter = input<number>(48);
}
