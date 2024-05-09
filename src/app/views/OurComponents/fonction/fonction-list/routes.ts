import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./fonction-list.component').then(m => m.FonctionListComponent),
    data: {
      title: $localize`Service`
    }
  }
];
