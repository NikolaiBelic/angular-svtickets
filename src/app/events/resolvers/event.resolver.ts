import { ResolveFn, Router } from '@angular/router';
import { MyEvent } from '../interfaces/MyEvent';
import { inject } from '@angular/core';
import { EventsService } from '../services/events.service';
import { catchError, EMPTY } from 'rxjs';

export const eventResolver: ResolveFn<MyEvent> = (route) => {
  const eventsService = inject(EventsService);
  const router = inject(Router);
  return eventsService.getEvent(+route.paramMap.get('id')!).pipe(
    catchError(() => {
      router.navigate(['/events']);
      return EMPTY;
    })
  );
};