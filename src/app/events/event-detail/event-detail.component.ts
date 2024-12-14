import { Component, inject, effect, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MyEvent } from '../interfaces/MyEvent';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';
import { EventCardComponent } from '../event-card/event-card.component';

@Component({
    selector: 'event-detail',
    standalone: true,
    imports: [OlMapDirective, OlMarkerDirective, EventCardComponent],
    templateUrl: './event-detail.component.html',
    styleUrl: './event-detail.component.css'
})
export class EventDetailComponent {
  constructor() {
    effect(() => {
      this.#title.setTitle(this.event()!.title + ' | Angular Events');
      this.coordinates.set([this.event()!.lng, this.event()!.lat]);
    });
  }

  coordinates = signal<[number, number]>([0, 0]);
  event = input.required<MyEvent>();
  deleted = output<void>();
  #title = inject(Title);
  #router = inject(Router);

  eventDeleted() {
    this.deleted.emit();
    this.#router.navigate(['/events']);
  }

  goBack() {
    this.#router.navigate(['/events']);
  }
}
