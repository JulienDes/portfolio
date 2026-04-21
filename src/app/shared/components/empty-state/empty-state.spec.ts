import { TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state';

describe('EmptyStateComponent', () => {
  it('displays the default title', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Nothing here yet.');
  });

  it('displays a custom title', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'No results found');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No results found');
  });

  it('does not render description paragraph when empty', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.detectChanges();
    const paragraphs: NodeListOf<HTMLElement> =
      fixture.nativeElement.querySelectorAll('p.description');
    expect(paragraphs.length).toBe(0);
  });

  it('renders description when provided', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('description', 'Try a different search');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Try a different search');
  });
});
