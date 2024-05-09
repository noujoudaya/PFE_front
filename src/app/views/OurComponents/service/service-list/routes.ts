import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./service-list.component').then(m => m.ServiceListComponent),
    data: {
      title: $localize`Service`
    }
  }
];
