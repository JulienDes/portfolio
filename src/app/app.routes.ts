import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'showcase',
    loadComponent: () =>
      import('./features/showcase/pages/showcase-page/showcase-page').then(
        (m) => m.ShowcasePageComponent,
      ),
  },
  { path: '', redirectTo: 'showcase', pathMatch: 'full' },
];
