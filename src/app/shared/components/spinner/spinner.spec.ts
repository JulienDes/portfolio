import { TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner';

describe('SpinnerComponent', () => {
  it('renders a mat-spinner', () => {
    const fixture = TestBed.createComponent(SpinnerComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-spinner')).toBeTruthy();
  });

  it('uses the default diameter of 48', () => {
    const fixture = TestBed.createComponent(SpinnerComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.diameter()).toBe(48);
  });

  it('accepts a custom diameter', () => {
    const fixture = TestBed.createComponent(SpinnerComponent);
    fixture.componentRef.setInput('diameter', 32);
    fixture.detectChanges();
    expect(fixture.componentInstance.diameter()).toBe(32);
  });
});
