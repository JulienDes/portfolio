import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SurfaceDirective } from './surface';

@Component({
  imports: [SurfaceDirective],
  template: `<div [surface]="role">content</div>`,
})
class TestHost {
  role: 'surface' | 'primary-container' | 'error-container' = 'surface';
}

describe('SurfaceDirective', () => {
  it('sets background color to the matching surface token', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(el.style.backgroundColor).toBe('var(--mat-sys-surface)');
    expect(el.style.color).toBe('var(--mat-sys-on-surface)');
  });

  it('uses the correct on-color for primary-container', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.role = 'primary-container';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(el.style.backgroundColor).toBe('var(--mat-sys-primary-container)');
    expect(el.style.color).toBe('var(--mat-sys-on-primary-container)');
  });

  it('uses the correct on-color for error-container', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.role = 'error-container';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(el.style.backgroundColor).toBe('var(--mat-sys-error-container)');
    expect(el.style.color).toBe('var(--mat-sys-on-error-container)');
  });
});
