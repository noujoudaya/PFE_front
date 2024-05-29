import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./fonction-secretaire.component').then(m => m.FonctionSecretaireComponent),
    data: {
      title: $localize`Fonctions`
    }
  }
];
