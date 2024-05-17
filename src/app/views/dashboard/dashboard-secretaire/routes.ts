import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard-secretaire.component').then(m => m.DashboardSecretaireComponent),
    data: {
      title: $localize`Dashboard`
    }
  }
];

