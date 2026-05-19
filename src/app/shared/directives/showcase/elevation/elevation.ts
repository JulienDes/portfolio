import { Directive, ElementRef, inject, input, OnChanges } from '@angular/core';

type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

@Directive({ selector: '[elevation]' })
export class ElevationDirective implements OnChanges {
  private readonly el = inject(ElementRef);

  readonly elevation = input.required<ElevationLevel>();

  ngOnChanges(): void {
    this.el.nativeElement.style.boxShadow = `var(--mat-sys-level${this.elevation()})`;
  }
}
