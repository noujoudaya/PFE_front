import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./departement-list.component').then(m => m.DepartementListComponent),
    data: {
      title: $localize`Departement`
    }
  }
];
