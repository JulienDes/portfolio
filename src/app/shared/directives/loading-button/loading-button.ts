import { Directive, ElementRef, inject, input, OnChanges } from '@angular/core';

@Directive({ selector: 'button[loading]' })
export class LoadingButtonDirective implements OnChanges {
  readonly loading = input.required<boolean>();

  private readonly el = inject(ElementRef<HTMLButtonElement>);

  ngOnChanges(): void {
    this.el.nativeElement.disabled = this.loading();
    this.el.nativeElement.style.position = 'relative';
  }
}
