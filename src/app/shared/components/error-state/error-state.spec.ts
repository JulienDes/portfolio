import { TestBed } from '@angular/core/testing';
import { ErrorStateComponent } from './error-state';

describe('ErrorStateComponent', () => {
  it('displays the default message', () => {
    const fixture = TestBed.createComponent(ErrorStateComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Something went wrong.');
  });

  it('displays a custom message', () => {
    const fixture = TestBed.createComponent(ErrorStateComponent);
    fixture.componentRef.setInput('message', 'Custom error');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Custom error');
  });

  it('shows the retry button when retryable is true', () => {
    const fixture = TestBed.createComponent(ErrorStateComponent);
    fixture.componentRef.setInput('retryable', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
  });

  it('hides the retry button when retryable is false', () => {
    const fixture = TestBed.createComponent(ErrorStateComponent);
    fixture.componentRef.setInput('retryable', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('emits retry when the button is clicked', () => {
    const fixture = TestBed.createComponent(ErrorStateComponent);
    fixture.componentRef.setInput('retryable', true);
    fixture.detectChanges();
    let emitted = false;
    fixture.componentInstance.retry.subscribe(() => (emitted = true));
    fixture.nativeElement.querySelector('button').click();
    expect(emitted).toBe(true);
  });
});
