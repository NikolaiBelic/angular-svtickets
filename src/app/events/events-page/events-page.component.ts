import { Component, signal, computed, inject, DestroyRef, effect } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MyEvent } from '../interfaces/MyEvent';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'events-page',
    standalone: true,
    imports: [ReactiveFormsModule, EventCardComponent],
    templateUrl: './events-page.component.html',
    styleUrl: './events-page.component.css'
})

export class EventsPageComponent {
  events = signal<MyEvent[]>([]);

  #eventsService = inject(EventsService);
  page = signal<number>(1);
  count = signal<number>(0);
  order = signal<string>('distance');
  searchEvents = new FormControl('');
  #destroyRef = inject(DestroyRef);

  search = toSignal(this.searchEvents.valueChanges.pipe(debounceTime(600)), { initialValue: '' });

  constructor() {
    effect(() => {
      this.loadEvents();
    }, { allowSignalWrites: true });
  }

  loadEvents() {
    this.#eventsService
      .getEvents(this.page(), this.order(), this.search()!)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((events) => {
        if (this.page() === 1) {
          this.events.set(events.events);
        } else {
          this.events.update(existingEvents => [...existingEvents, ...events.events]);
        }
        this.count.set(events.count);
        console.log(this.count());
        console.log(this.events().length);
      });
  }

  changeOrder(order: string) {
    this.page.set(1);
    this.order.set(order);
    // Reset page to 1 when order changes
  }

  loadMore() {
    this.page.update(page => page + 1);      
  }

  deleteEvent(event: MyEvent) {
    this.events.update(events => events.filter((e) => e !== event));
  }
}
