import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'projects/:id',
    loadComponent: () => import('./project-detail/project-detail').then((m) => m.ProjectDetail),
  },
];
