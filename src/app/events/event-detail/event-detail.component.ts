import { Component, inject, effect, input, output, signal, CreateEffectOptions, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MyEvent, Comment } from '../interfaces/MyEvent';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';
import { EventCardComponent } from '../event-card/event-card.component';
import { User } from '../../profile/interfaces/user'; 
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ErrorModalComponent } from '../../shared/modals/error-modal/error-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'event-detail',
    standalone: true,
    imports: [OlMapDirective, OlMarkerDirective, EventCardComponent, RouterLink, ReactiveFormsModule, DatePipe],
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

  #fb = inject(NonNullableFormBuilder);
  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  coordinates: [number, number] = [0, 0];
  event = input.required<MyEvent>();
  deleted = output<void>();
  #title = inject(Title);
  #router = inject(Router);
  users = signal<User[]>([]);
  comments = signal<Comment[]>([]);
  #modalService = inject(NgbModal);

  commentForm = this.#fb.group(
      {
        comment: ['', []],
      }
    );

  ngOnInit() {
    this.loadUsers();
    this.loadComments();
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

  postComment() {
    this.#eventsService.postComment(this.event().id, this.commentForm.getRawValue().comment).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => {
        this.commentForm.reset();
        this.loadComments(); // Recargar comentarios después de publicar uno nuevo
      },
      error: (err) => {
        console.error(err, 'You can\'t comment if you are no attending to the event');
        const modalRefError = this.#modalService.open(ErrorModalComponent);
        setTimeout(() => {
          modalRefError.close();
        }, 1500);
      }
    });
  }

  loadComments() {
    this.#eventsService.getComments(this.event().id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: (response) => {
        this.comments.set(response.comments); // Asignar el array de comentarios
        console.log(this.comments());
      },
      error: (err) => {
        console.error('Error loading comments:', err);
      }
    });
  }

  attendChanged() {
    this.loadUsers();
  }
}
