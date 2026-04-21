import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ElevationDirective } from './elevation';

@Component({
  imports: [ElevationDirective],
  template: `<div [elevation]="level">content</div>`,
})
class TestHost {
  level: 0 | 1 | 2 | 3 | 4 | 5 = 2;
}

describe('ElevationDirective', () => {
  it('sets box-shadow to the matching Material level token', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(el.style.boxShadow).toBe('var(--mat-sys-level2)');
  });

  it('updates box-shadow when level changes', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.level = 4;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(el.style.boxShadow).toBe('var(--mat-sys-level4)');
  });
});
