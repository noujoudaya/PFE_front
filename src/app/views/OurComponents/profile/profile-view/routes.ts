import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./profile-view.component').then(m => m.ProfileViewComponent),
    data: {
      title: $localize`Profile`
    }
  }
];
