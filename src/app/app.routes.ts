import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'showcase',
    loadComponent: () =>
      import('./features/showcase/pages/showcase-page/showcase-page').then(
        (m) => m.ShowcasePageComponent,
      ),
  },
  {
    path: 'example',
    loadComponent: () =>
      import('./features/example/pages/example-page/example-page').then(
        (m) => m.ExamplePageComponent,
      ),
  },
  { path: '', redirectTo: 'showcase', pathMatch: 'full' },
];
