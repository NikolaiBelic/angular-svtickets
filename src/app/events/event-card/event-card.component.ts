import { DatePipe } from '@angular/common';
import { Component, input, output, inject, signal } from '@angular/core';
import { MyEvent } from '../interfaces/MyEvent';
import { EventsService } from '../services/events.service';
import { IntlCurrencyPipe } from '../../shared/pipes/intl-currency.pipe';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faThumbsDown, faThumbsUp, faTrash, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'event-card',
  imports: [DatePipe, IntlCurrencyPipe, RouterLink, FontAwesomeModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  event = input.required<MyEvent>();
  deleted = output<void>();
  #eventsService = inject(EventsService);
  attendChanged = output<void>();
  #modalService = inject(NgbModal);

  attend = signal<boolean>(false);
  numAttend = signal<number>(0);

  icons = { faThumbsDown, faThumbsUp, faTrash, faUserGroup };

  ngOnInit() {
    this.attend.set(this.event().attend);
    this.numAttend.set(this.event().numAttend);
  }

  deleteEvent() {
    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Confirm Deletion';
    modalRef.componentInstance.body = 'Are you sure you want to delete this event?';
    modalRef.result.then((result) => {
      if (result) {
        this.#eventsService.deleteEvent(this.event().id).subscribe(() => {
          this.deleted.emit();
        });
      }
    }).catch(() => { });
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
