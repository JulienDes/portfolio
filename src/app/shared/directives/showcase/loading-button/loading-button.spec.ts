import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LoadingButtonDirective } from './loading-button';

@Component({
  imports: [LoadingButtonDirective],
  template: `<button [loading]="isLoading()">Submit</button>`,
})
class TestHost {
  isLoading = signal(false);
}

describe('LoadingButtonDirective', () => {
  it('is not disabled when loading is false', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.disabled).toBe(false);
  });

  it('disables the button when loading is true', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.isLoading.set(true);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.disabled).toBe(true);
  });

  it('re-enables the button when loading returns to false', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.isLoading.set(true);
    fixture.detectChanges();
    fixture.componentInstance.isLoading.set(false);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.disabled).toBe(false);
  });
});
