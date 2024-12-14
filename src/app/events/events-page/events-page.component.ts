import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MyEvent } from '../interfaces/MyEvent';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'events-page',
    standalone: true,
    imports: [FormsModule, EventCardComponent],
    templateUrl: './events-page.component.html',
    styleUrl: './events-page.component.css'
})

export class EventsPageComponent {
  events = signal<MyEvent[]>([]);

  #eventsService = inject(EventsService);
  page = 1;
  count = signal<number>(0);

  search = signal('');
  filteredEvents = computed(() => {
    const searchLower = this.search()?.toLocaleLowerCase();
    return searchLower
      ? this.events().filter((event) =>
        event.title.toLocaleLowerCase().includes(searchLower) ||
        event.description.toLocaleLowerCase().includes(searchLower)
      )
      : this.events();
  });

  constructor() {
    const ev = this.#eventsService
      .getEvents()
      .pipe(takeUntilDestroyed())
      .subscribe((events) => {
        console.log(events);
        this.events.set(events.events)
        this.count.set(events.count);
        console.log(events.count);
        console.log(events.page);
        console.log(events.more);
        console.log(events.events);
    });
  }

  loadMore() {
    this.page++;
    this.#eventsService
      .getEvents(this.page, 'distance', this.search())
      .pipe()
      .subscribe((events) => {
        this.events.set([...this.events(), ...events.events]);
        console.log(this.events());
      });

      
  }

  addEvent(event: MyEvent) {
    this.events.update(events => [...events, event]);
  }

  deleteEvent(event: MyEvent) {
    this.events.update(events => events.filter((e) => e !== event));
  }

  orderByDate() {
    this.events.set(this.events().toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  }

  orderByPrice() {
    this.events.set(this.events().toSorted((a, b) => a.price - b.price)); // Actualiza la señal con el nuevo array ordenado
  }
}
