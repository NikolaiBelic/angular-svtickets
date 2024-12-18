import { Component, inject, effect, input, output, signal, CreateEffectOptions, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MyEvent } from '../interfaces/MyEvent';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';
import { EventCardComponent } from '../event-card/event-card.component';
import { User } from '../../profile/interfaces/user'; 
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { load } from 'ol/Image';

@Component({
    selector: 'event-detail',
    standalone: true,
    imports: [OlMapDirective, OlMarkerDirective, EventCardComponent, RouterLink],
    templateUrl: './event-detail.component.html',
    styleUrl: './event-detail.component.css'
})
export class EventDetailComponent {
  constructor() {
    effect(() => {
      this.#title.setTitle(this.event()!.title + ' | Angular Events');
      this.coordinates = [this.event().lng, this.event().lat];
      console.log(this.coordinates);
    }, { allowSignalWrites: true } as CreateEffectOptions);
  }

  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  coordinates: [number, number] = [0, 0];
  event = input.required<MyEvent>();
  deleted = output<void>();
  #title = inject(Title);
  #router = inject(Router);
  users = signal<User[]>([]);

  ngOnInit() {
    this.loadUsers();
  }

  eventDeleted() {
    this.deleted.emit();
    this.#router.navigate(['/events']);
  }

  loadUsers() {
    this.#eventsService.getAttendees(this.event().id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((resp) => {
      this.users.set(resp.users);
    });
  }

  attendChanged() {
    this.loadUsers();
  }
}
