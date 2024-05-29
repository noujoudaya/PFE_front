import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./service-secretaire.component').then(m => m.ServiceSecretaireComponent),
    data: {
      title: $localize`Services`
    }
  }
];
