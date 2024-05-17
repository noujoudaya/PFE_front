import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./departement-emp-sec.component').then(m => m.DepartementEmpSecComponent),
    data: {
      title: $localize`Departements`
    }
  }
];
