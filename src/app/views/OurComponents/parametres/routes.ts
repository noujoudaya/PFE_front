import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./parametres.component').then(m => m.ParametresComponent),
    data: {
      title: $localize`Paramètres`
    }
  }
];
