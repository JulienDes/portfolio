import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <span>AppName</span>
    </footer>
  `,
  styles: [
    `
      @use 'styles/sys' as sys;

      .footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid sys.$outline-variant;
        background: sys.$surface-container;
        color: sys.$on-surface-variant;
        font: sys.$body-small;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class FooterComponent {}
