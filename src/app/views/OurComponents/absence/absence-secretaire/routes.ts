import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./absence-secretaire.component').then(m => m.AbsenceSecretaireComponent),
    data: {
      title: $localize`Absences`
    }
  }
];
