import {Routes} from '@angular/router';
import {DefaultLayoutComponent} from './layout';
import {
  DemandesAttestationListComponent
} from "./views/OurComponents/demandesAttestation/demandes-attestation-list/demandes-attestation-list.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'profile',
        loadChildren: () => import('./views/OurComponents/profile/profile-view/routes').then((m) => m.routes)
      },
      {
        path: 'employee-list',
        loadChildren: () => import('./views/OurComponents/employes/employes-list/routes').then((m) => m.routes)
      },
      {
        path: 'demande/conge',
        loadChildren: () => import('./views/OurComponents/demandesConge/demandes-conge-list/routes').then((m) => m.routes)
      },
      {
        path: 'employe/demande/conge',
        loadChildren: () => import('./views/OurComponents/demandesConge/demande-conge-emp-sec/routes').then((m) => m.routes)
      },
      {
        path: 'demande/attestation',
        loadChildren: () => import('./views/OurComponents/demandesAttestation/demandes-attestation-list/routes').then((m) => m.routes)
      },
      {
        path: 'employe/demande/attestation',
        loadChildren: () => import('./views/OurComponents/demandesAttestation/demande-attestation-emp-sec/routes').then((m) => m.routes)
      },
      {
        path: 'absence',
        loadChildren: () => import('./views/OurComponents/absence/absence-list/routes').then((m) => m.routes)
      },
      {
        path: 'secretaire/absence',
        loadChildren: () => import('./views/OurComponents/absence/absence-secretaire/routes').then((m) => m.routes)
      },
      {
        path: 'retard',
        loadChildren: () => import('./views/OurComponents/retard/retard-list/routes').then((m) => m.routes)
      },
      {
        path: 'secretaire/retard',
        loadChildren: () => import('./views/OurComponents/retard/retard-secretaire/routes').then((m) => m.routes)
      },
      {
        path: 'departement',
        loadChildren: () => import('./views/OurComponents/departement/departement-list/routes').then((m) => m.routes)
      },
      {
        path: 'service',
        loadChildren: () => import('./views/OurComponents/service/service-list/routes').then((m) => m.routes)
      },
      {
        path: 'fonction',
        loadChildren: () => import('./views/OurComponents/fonction/fonction-list/routes').then((m) => m.routes)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'activate-account',
    loadComponent: () => import('./views/pages/activate-account/activate-account.component').then(m => m.ActivateAccountComponent),
    data: {
      title: 'Activate Account Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
