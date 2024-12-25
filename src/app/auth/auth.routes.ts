import { Routes } from '@angular/router';
import { logoutActivateGuard } from '../shared/guards/logout-activate.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(
        (m) => m.LoginComponent
      ),
    title: 'Login Page | Angular Events',
    canActivate: [logoutActivateGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then(
        (m) => m.RegisterComponent
      ),
    title: 'Register Page | Angular Events',
    canActivate: [logoutActivateGuard],
    }
];