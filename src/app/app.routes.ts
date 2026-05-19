import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // Single-page shell — all sections live here as anchor fragments
    path: '',
    title: 'Julien Desrosiers - AI Engineer & Software Developer',
    loadComponent: () =>
      import('./features/home/pages/home-page/home-page').then((m) => m.HomePageComponent),
  },
  {
    path: 'showcase',
    loadComponent: () =>
      import('./features/showcase/pages/showcase-page/showcase-page').then(
        (m) => m.ShowcasePageComponent,
      ),
  },
];
