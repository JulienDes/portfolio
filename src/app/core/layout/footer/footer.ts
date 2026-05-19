import { Component, inject } from '@angular/core';
import { LangService } from '../../lang/lang';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="site-footer">
      <div class="footer-inner">
        <!-- LEFT: copyright -->
        <p class="footer-meta mono footer-copyright">© {{ year }} - Julien Desrosiers</p>

        <!-- CENTER: ASCII AI agent + source code text -->
        <p class="footer-meta mono footer-source">
          <a
            href="https://github.com/JulienDes/portfolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{
              lang.t(
                'The source code is available on GitHub',
                'Le code source est disponible sur GitHub'
              )
            }}<span class="footer-arr">↗</span>
          </a>
        </p>

        <!-- RIGHT: links -->
        <div class="footer-links mono">
          <a href="https://github.com/JulienDes" target="_blank" rel="noopener noreferrer">
            GitHub <span class="footer-arr">↗</span>
          </a>
          <a
            href="https://www.linkedin.com/in/JulienDes/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn <span class="footer-arr">↗</span>
          </a>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      @use 'styles/sys' as sys;
      @use 'styles/spacing' as sp;

      .site-footer {
        border-top: 1px solid sys.$outline-variant;
        background: sys.$surface-container-low;
        padding-bottom: env(safe-area-inset-bottom, 0px);
      }

      .footer-inner {
        max-width: 1100px;
        margin: 0 auto;
        padding: sp.$xl sp.$xl;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        font-size: sys.$label-medium;
        color: sys.$on-surface-variant;

        @media (max-width: 800px) {
          padding: sp.$lg sp.$md;
          grid-template-columns: 1fr;
          gap: sp.$sm;
          text-align: center;
        }
      }

      /* LEFT */
      .footer-copyright {
        text-align: left;
        margin: 0;
        opacity: 0.65;
        letter-spacing: 0.02em;
        font-family: sys.$font-mono;

        @media (max-width: 800px) {
          text-align: center;
          order: 3;
        }
      }

      .footer-source {
        margin: 0;
        opacity: 0.55;
        letter-spacing: 0.02em;
        font-family: sys.$font-mono;
        white-space: nowrap;
        font-size: sys.$label-small;

        a {
          color: sys.$on-surface-variant;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition:
            color 150ms ease,
            opacity 150ms ease;

          &:hover {
            color: sys.$primary;
            opacity: 1;
          }
        }

        @media (max-width: 800px) {
          white-space: normal;
          text-align: center;
        }
      }

      /* RIGHT */
      .footer-links {
        display: flex;
        gap: sp.$lg;
        justify-content: flex-end;

        @media (max-width: 800px) {
          justify-content: center;
          order: 2;
        }

        a {
          color: sys.$on-surface-variant;
          text-decoration: none;
          opacity: 0.6;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition:
            color 150ms ease,
            opacity 150ms ease;
          font-family: sys.$font-mono;

          &:hover {
            color: sys.$primary;
            opacity: 1;
          }
        }
      }

      .footer-arr {
        font-size: 0.625rem;
        transition: transform 200ms ease;

        a:hover & {
          transform: translate(2px, -2px);
        }
      }

      .footer-meta {
        margin: 0;
        opacity: 0.65;
        letter-spacing: 0.02em;
        font-family: sys.$font-mono;

        strong {
          color: sys.$on-surface-variant;
          font-weight: 500;
          opacity: 1;
        }
      }

      .footer-accent {
        color: sys.$primary;
        font-weight: 500;
        opacity: 1;
      }
    `,
  ],
})
export class FooterComponent {
  readonly lang = inject(LangService);
  readonly year = new Date().getFullYear();
}
