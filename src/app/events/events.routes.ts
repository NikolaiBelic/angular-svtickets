import { Routes } from '@angular/router';
import { leavePageGuard } from '../shared/guards/leave-page.guard';
import { numericIdGuard } from '../shared/guards/numeric-id.guard';
import { eventResolver } from './resolvers/event.resolver';

export const eventsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./events-page/events-page.component').then(
        (m) => m.EventsPageComponent
      ),
    title: 'Events Page | Angular Events',
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./event-form/event-form.component').then(
        (m) => m.EventFormComponent
      ),
    title: 'New Event | Angular Events',
    canDeactivate: [leavePageGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./event-detail/event-detail.component').then(
        (m) => m.EventDetailComponent
      ),
    resolve: {
      event: eventResolver,
    },
    canActivate: [numericIdGuard],
  },
];