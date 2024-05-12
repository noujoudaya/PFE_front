import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./absence-list.component').then(m => m.AbsenceListComponent),
    data: {
      title: $localize`Absences`
    }
  }
];
