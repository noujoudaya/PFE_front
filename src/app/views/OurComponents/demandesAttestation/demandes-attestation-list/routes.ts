import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./demandes-attestation-list.component').then(m => m.DemandesAttestationListComponent),
    data: {
      title: $localize`Demandes / Attestations`
    }
  }
];
