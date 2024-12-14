import { DatePipe } from '@angular/common';
import { Component, input, output, inject } from '@angular/core';
import { MyEvent } from '../interfaces/MyEvent';
import { EventsService } from '../services/events.service';
import { IntlCurrencyPipe } from '../../shared/pipes/intl-currency.pipe';
import { RouterLink } from '@angular/router';


@Component({
    selector: 'event-card',
    standalone: true,
    imports: [DatePipe, IntlCurrencyPipe, RouterLink],
    templateUrl: './event-card.component.html',
    styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  event = input.required<MyEvent>();
  deleted = output<void>();
  #eventsService = inject(EventsService);

  deleteEvent() {
    this.#eventsService
      .deleteEvent(this.event().id!)
      .subscribe(() => this.deleted.emit());
  }
}
