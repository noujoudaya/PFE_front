import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./demandes-conge-list.component').then(m => m.DemandesCongeListComponent),
    data: {
      title: $localize`Demandes / Conges`
    }
  }
];
