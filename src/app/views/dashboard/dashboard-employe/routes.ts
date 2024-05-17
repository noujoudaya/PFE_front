import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard-employe.component').then(m => m.DashboardEmployeComponent),
    data: {
      title: $localize`Dashboard`
    }
  }
];

