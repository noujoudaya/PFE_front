import { Routes } from '@angular/router';


export const routes: Routes = [  {
  path: '',
  data: {
    title: 'Paie'
  },
  children: [
    {
      path: '',
      redirectTo: 'bulletin-paie-list',
      pathMatch: 'full'
    },
    {
      path: 'bulletin-paie-list',
      loadComponent: () => import('./bulletin-paie-list/bulletin-paie-list.component').then(m => m.BulletinPaieListComponent),
      data: {
        title: 'bulletin paie list'
      }
    },
    {
      path: 'bulletin-paie',
      loadComponent: () => import('./bulletin-paie-create/bulletin-paie-create.component').then(m => m.BulletinPaieCreateComponent),
      data: {
        title: 'bulletin paie'
      }
    },
  ]
}
];
