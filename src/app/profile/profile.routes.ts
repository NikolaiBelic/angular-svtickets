import { Routes } from '@angular/router';
import { numericIdGuard } from '../shared/guards/numeric-id.guard';
import { profileResolver } from './resolvers/profile.resolver';

export const profileRoutes: Routes = [
    {
        path: 'me',
        loadComponent: () =>
            import('./profile-page/profile-page.component').then(
                (m) => m.ProfilePageComponent
            ),
        title: 'Profile Page | Angular Events',
        resolve: {
            user: profileResolver,
        }
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./profile-page/profile-page.component').then(
                (m) => m.ProfilePageComponent
            ),
        title: 'Profile Page | Angular Events',
        resolve: {
            user: profileResolver,
        },
        canActivate: [numericIdGuard],
    },
    {
      path: '',
      redirectTo: 'me',
      pathMatch: 'full'
    },
    {
      path: '**',
      redirectTo: '/events'
    }
];