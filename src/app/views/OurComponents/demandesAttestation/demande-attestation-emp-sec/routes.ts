import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./demande-attestation-emp-sec.component').then(m => m.DemandeAttestationEmpSecComponent),
    data: {
      title: $localize`Demandes / Attestations`
    }
  }
];
