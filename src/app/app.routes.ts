import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'status',
    loadComponent: () => import('./status-screen/status-screen').then((m) => m.StatusScreen),
  },
  {
    path: 'projects/:id',
    loadComponent: () => import('./project-detail/project-detail').then((m) => m.ProjectDetail),
  },
];
