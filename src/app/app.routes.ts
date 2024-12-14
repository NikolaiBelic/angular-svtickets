import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.authRoutes),
    title: 'Bienvenido | Angular Products',
  },
  {
    path: 'events',
    loadChildren: () =>
      import('./events/events.routes').then((m) => m.eventsRoutes),
  },
  { path: '', redirectTo: '/events', pathMatch: 'full' }
  // Aquí podríamos cargar un página de error 404 por ejemplo
];
