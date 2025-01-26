import { Component, signal, inject, DestroyRef, effect, input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MyEvent } from '../interfaces/MyEvent';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventsService } from '../services/events.service';
import { ProfileService } from '../../profile/services/profile.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'events-page',
    imports: [ReactiveFormsModule, EventCardComponent],
    templateUrl: './events-page.component.html',
    styleUrl: './events-page.component.css'
})

export class EventsPageComponent {
  events = signal<MyEvent[]>([]);

  #eventsService = inject(EventsService);
  #profileService = inject(ProfileService);

  page = signal<number>(1);
  count = signal<number>(0);
  order = signal<string>('distance');
  searchEvents = new FormControl('');
  #destroyRef = inject(DestroyRef);

  creator = input<number>();
  attending = input<number>();
  name = signal<string>('');


  search = toSignal(this.searchEvents.valueChanges.pipe(debounceTime(600)), { initialValue: '' });

  constructor() {
    effect(() => {
      this.loadEvents();
    });
  }

  loadEvents() {
    this.#eventsService
      .getEvents(this.page(), this.order(), this.search()!, this.creator(), this.attending())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((events) => {
        if (this.page() === 1) {
          this.events.set(events.events);
        } else {
          this.events.update(existingEvents => [...existingEvents, ...events.events]);
        }
        if (this.creator()) {
          this.getName(this.creator()!).subscribe((name) => {
            this.name.set(name);
          });
        } else if (this.attending()) {
          this.getName(this.attending()!).subscribe((name) => {
            this.name.set(name);
          });
        } else {
          this.name.set('All Events');
        }
        this.count.set(events.count);
      });
  }

  changeOrder(order: string) {
    this.page.set(1);
    this.order.set(order);
  }

  loadMore() {
    this.page.update(page => page + 1);
  }

  deleteEvent(event: MyEvent) {
    this.events.update(events => events.filter((e) => e !== event));
  }

  getName(id: number) {
    return this.#profileService.getProfile(id).pipe(map((user) => user.name));
  }
}
