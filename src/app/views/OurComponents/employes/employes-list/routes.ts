import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./employes-list.component').then(m => m.EmployesListComponent),
    data: {
      title: $localize`Employees`
    }
  }
];
