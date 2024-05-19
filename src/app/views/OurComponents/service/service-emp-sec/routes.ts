import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./service-emp-sec.component').then(m => m.ServiceEmpSecComponent),
    data: {
      title: $localize`Services`
    }
  }
];
