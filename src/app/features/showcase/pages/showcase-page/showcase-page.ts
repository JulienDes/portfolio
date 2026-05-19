import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { httpResource } from '@angular/common/http';

import { TextColorDirective } from '../../../../shared/directives/showcase/text-color/text-color';
import { SurfaceDirective } from '../../../../shared/directives/showcase/surface/surface';
import { ElevationDirective } from '../../../../shared/directives/showcase/elevation/elevation';
import { LoadingButtonDirective } from '../../../../shared/directives/showcase/loading-button/loading-button';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog';

interface Post {
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-showcase-page',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    TextColorDirective,
    SurfaceDirective,
    ElevationDirective,
    LoadingButtonDirective,
    SpinnerComponent,
    ErrorStateComponent,
    EmptyStateComponent,
  ],
  templateUrl: './showcase-page.html',
  styleUrl: './showcase-page.scss',
})
export class ShowcasePageComponent {
  private readonly dialog = inject(MatDialog);

  readonly isSubmitting = signal(false);
  readonly showEmpty = signal(false);
  readonly showError = signal(false);

  readonly posts = httpResource<Post[]>(
    () => 'https://jsonplaceholder.typicode.com/posts?_limit=3',
  );

  readonly elevationLevels = [0, 1, 2, 3, 4, 5] as const;

  readonly textRoles = [
    'primary',
    'secondary',
    'tertiary',
    'error',
    'on-surface',
    'on-surface-variant',
  ] as const;

  readonly surfaceRoles = [
    'surface',
    'surface-container-low',
    'surface-container',
    'surface-container-high',
    'surface-container-highest',
    'primary-container',
    'secondary-container',
    'tertiary-container',
    'error-container',
  ] as const;

  simulateSubmit(): void {
    this.isSubmitting.set(true);
    setTimeout(() => this.isSubmitting.set(false), 2000);
  }

  openConfirm(): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete item',
        message: 'This action cannot be undone. Are you sure?',
        confirmLabel: 'Delete',
        destructive: true,
      },
    });
  }
}
