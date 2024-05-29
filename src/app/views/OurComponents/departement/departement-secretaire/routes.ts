import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./departement-secretaire.component').then(m => m.DepartementSecretaireComponent),
    data: {
      title: $localize`Departement`
    }
  }
];
