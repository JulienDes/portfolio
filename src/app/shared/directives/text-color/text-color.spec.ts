import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TextColorDirective } from './text-color';

@Component({
  imports: [TextColorDirective],
  template: `<span [textColor]="role">text</span>`,
})
class TestHost {
  role: 'primary' | 'error' | 'on-surface' = 'primary';
}

describe('TextColorDirective', () => {
  it('sets color to the matching Material system token', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(el.style.color).toBe('var(--mat-sys-primary)');
  });

  it('updates color when role changes', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.role = 'error';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(el.style.color).toBe('var(--mat-sys-error)');
  });
});
