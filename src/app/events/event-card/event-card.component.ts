import { DatePipe } from '@angular/common';
import { Component, input, output, inject, signal } from '@angular/core';
import { MyEvent } from '../interfaces/MyEvent';
import { EventsService } from '../services/events.service';
import { IntlCurrencyPipe } from '../../shared/pipes/intl-currency.pipe';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faThumbsDown, faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'event-card',
    standalone: true,
    imports: [DatePipe, IntlCurrencyPipe, RouterLink, FontAwesomeModule],
    templateUrl: './event-card.component.html',
    styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  event = input.required<MyEvent>();
  deleted = output<void>();
  #eventsService = inject(EventsService);
  attendChanged = output<void>();

  attend = signal<boolean>(false);
  numAttend = signal<number>(0);

  icons = {faThumbsDown, faThumbsUp, faTrash};

  ngOnInit() {
    this.attend.set(this.event().attend);
    this.numAttend.set(this.event().numAttend);
  }

  deleteEvent() {
    this.#eventsService
      .deleteEvent(this.event().id!)
      .subscribe(() => this.deleted.emit());
  }

  postAttend() {
    this.#eventsService.postAttend(this.event().id!).subscribe(() => {
      this.attend.set(!this.attend());
      this.numAttend.update(num => num + (this.attend() ? 1 : -1));
      this.attendChanged.emit();
    });
  }

  deleteAttend() { 
    this.#eventsService.deleteAttend(this.event().id!).subscribe(() => {
      this.attend.set(!this.attend());
      this.numAttend.update(num => num + (this.attend() ? 1 : -1));
      this.attendChanged.emit();
    });
  }
}
