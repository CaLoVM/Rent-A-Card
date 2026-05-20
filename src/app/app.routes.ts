import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';


const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound);
const baseTitle = 'Car';

export const routes: Routes = [
  { path: 'home', component: Home, title: `${baseTitle} - Home` },

  {
    path: 'renting',
    loadChildren: () =>
      import('./renting/presentation/views/renting.routes').then((m) => m.rentingRoutes),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', loadComponent: pageNotFound, title: `${baseTitle} - Page Not Found` },
];
