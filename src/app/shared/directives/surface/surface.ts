import { Directive, ElementRef, inject, input, OnChanges } from '@angular/core';

type SurfaceRole =
  | 'surface'
  | 'surface-variant'
  | 'surface-container-lowest'
  | 'surface-container-low'
  | 'surface-container'
  | 'surface-container-high'
  | 'surface-container-highest'
  | 'primary-container'
  | 'secondary-container'
  | 'tertiary-container'
  | 'error-container';

const ON_COLOR: Record<SurfaceRole, string> = {
  surface: '--mat-sys-on-surface',
  'surface-variant': '--mat-sys-on-surface-variant',
  'surface-container-lowest': '--mat-sys-on-surface',
  'surface-container-low': '--mat-sys-on-surface',
  'surface-container': '--mat-sys-on-surface',
  'surface-container-high': '--mat-sys-on-surface',
  'surface-container-highest': '--mat-sys-on-surface',
  'primary-container': '--mat-sys-on-primary-container',
  'secondary-container': '--mat-sys-on-secondary-container',
  'tertiary-container': '--mat-sys-on-tertiary-container',
  'error-container': '--mat-sys-on-error-container',
};

@Directive({ selector: '[surface]' })
export class SurfaceDirective implements OnChanges {
  readonly surface = input.required<SurfaceRole>();

  private readonly el = inject(ElementRef);

  ngOnChanges(): void {
    const role = this.surface();
    const el = this.el.nativeElement;
    el.style.backgroundColor = `var(--mat-sys-${role})`;
    el.style.color = `var(${ON_COLOR[role]})`;
  }
}
