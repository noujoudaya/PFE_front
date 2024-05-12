import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./retard-secretaire.component').then(m => m.RetardSecretaireComponent),
    data: {
      title: $localize`Retards`
    }
  }
];
