import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import {ProfileViewComponent} from "./views/OurComponents/profile/profile-view/profile-view.component";
import {EmployesListComponent} from "./views/OurComponents/employes/employes-list/employes-list.component";
import {
  DemandesCongeListComponent
} from "./views/OurComponents/demandesConge/demandes-conge-list/demandes-conge-list.component";
import {
  DemandesAttestationListComponent
} from "./views/OurComponents/demandesAttestation/demandes-attestation-list/demandes-attestation-list.component";
import {AbsenceListComponent} from "./views/OurComponents/absence/absence-list/absence-list.component";
import {RetardListComponent} from "./views/OurComponents/retard/retard-list/retard-list.component";

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
        component:ProfileViewComponent
      },
      {
        path: 'employee-list',
        component: EmployesListComponent
      },
      {
        path: 'demande/conge',
        component:DemandesCongeListComponent
      },
      {
        path: 'demande/attestation',
        component:DemandesAttestationListComponent
      },
      {
        path: 'absence',
        component:AbsenceListComponent
      },
      {
        path: 'retard',
        component:RetardListComponent
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
