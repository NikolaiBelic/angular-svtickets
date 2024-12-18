import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EventsResponse, SingleEventResponse, UsersResponse } from '../interfaces/responses';
import { map, Observable } from 'rxjs';
import { MyEvent, MyEventInsert } from '../interfaces/MyEvent';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  #eventsUrl = 'events';
  #http = inject(HttpClient);

  getEvents(page = 1, order = 'distance', search = '', creator?: number, attending?: number): Observable<EventsResponse> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('order', order)
      .set('search', search);

    if (creator) {
      params = params.set('creator', String(creator));
    }

    if (attending) {
      params = params.set('attending', String(attending));
    }

    return this.#http.get<EventsResponse>(`${this.#eventsUrl}`, { params });
  }

  /* getEvents(): Observable<MyEvent[]> {
    return this.#http
      .get<EventsResponse>(this.#eventsUrl)
      .pipe(map((resp) => resp.events));
  } */

  getEvent(id: number): Observable<MyEvent> {
    return this.#http
      .get<SingleEventResponse>(`${this.#eventsUrl}/${id}`)
      .pipe(map((resp) => resp.event));
  }

  insertEvent(event: MyEventInsert): Observable<MyEventInsert> {
    return this.#http
      .post<SingleEventResponse>(this.#eventsUrl, event)
      .pipe(map((resp) => resp.event));
  }

  deleteEvent(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#eventsUrl}/${id}`);
  }

  postAttend(id: number): Observable<void> {
    return this.#http.post<void>(`${this.#eventsUrl}/${id}/attend`, {});
  }

  deleteAttend(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#eventsUrl}/${id}/attend`);
  }

  getAttendees(id: number): Observable<UsersResponse> {
    return this.#http.get<UsersResponse>(`${this.#eventsUrl}/${id}/attend`);
}
}


/* filteredEvents = computed(() => {
    const searchLower = this.search()?.toLocaleLowerCase();
    return searchLower
      ? this.events().filter((event) =>
        event.title.toLocaleLowerCase().includes(searchLower) ||
        event.description.toLocaleLowerCase().includes(searchLower)
      )
      : this.events();
  }); */