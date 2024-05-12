import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./demande-conge-emp-sec.component').then(m => m.DemandeCongeEmpSecComponent),
    data: {
      title: $localize`Demandes / Congés`
    }
  }
];
