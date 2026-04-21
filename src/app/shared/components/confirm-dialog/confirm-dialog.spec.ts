import { TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog';

const makeFixture = (data: object) => {
  TestBed.configureTestingModule({
    providers: [
      { provide: MatDialogRef, useValue: { close: () => {} } },
      { provide: MAT_DIALOG_DATA, useValue: data },
    ],
  });
  return TestBed.createComponent(ConfirmDialogComponent);
};

describe('ConfirmDialogComponent', () => {
  it('renders the title and message', () => {
    const fixture = makeFixture({ title: 'Delete item', message: 'Are you sure?' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Delete item');
    expect(fixture.nativeElement.textContent).toContain('Are you sure?');
  });

  it('uses custom label for confirm button', () => {
    const fixture = makeFixture({
      title: 'Remove',
      message: 'Confirm?',
      confirmLabel: 'Yes, remove',
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Yes, remove');
  });

  it('closes with false when cancel is clicked', () => {
    const ref = { close: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: ref },
        { provide: MAT_DIALOG_DATA, useValue: { title: 'T', message: 'M' } },
      ],
    });
    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    fixture.detectChanges();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();
    expect(ref.close).toHaveBeenCalledWith(false);
  });

  it('closes with true when confirm is clicked', () => {
    const ref = { close: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: ref },
        { provide: MAT_DIALOG_DATA, useValue: { title: 'T', message: 'M' } },
      ],
    });
    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    fixture.detectChanges();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();
    expect(ref.close).toHaveBeenCalledWith(true);
  });
});
