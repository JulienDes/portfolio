import { Directive, ElementRef, inject, input, OnChanges } from '@angular/core';

type TextColorRole =
  | 'primary'
  | 'on-primary'
  | 'secondary'
  | 'on-secondary'
  | 'tertiary'
  | 'on-tertiary'
  | 'error'
  | 'on-error'
  | 'on-surface'
  | 'on-surface-variant'
  | 'on-background';

@Directive({ selector: '[textColor]' })
export class TextColorDirective implements OnChanges {
  readonly textColor = input.required<TextColorRole>();

  private readonly el = inject(ElementRef);

  ngOnChanges(): void {
    this.el.nativeElement.style.color = `var(--mat-sys-${this.textColor()})`;
  }
}
