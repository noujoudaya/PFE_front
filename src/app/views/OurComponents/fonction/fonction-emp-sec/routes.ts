import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./fonction-emp-sec.component').then(m => m.FonctionEmpSecComponent),
    data: {
      title: $localize`Fonctions`
    }
  }
];
