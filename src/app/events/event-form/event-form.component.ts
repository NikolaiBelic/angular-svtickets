import { Component, DestroyRef, inject, signal, input, effect, ViewChild } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventsService } from '../services/events.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { minDateValidator } from '../../shared/validators/min-date.validator';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';
import { GaAutocompleteDirective } from '../../shared/directives/ol-maps/ga-autocomplete.directive';
import { SearchResult } from '../../shared/interfaces/search-result';
import { MyEvent } from '../interfaces/MyEvent';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { NgForm } from '@angular/forms';
import { LoadButtonComponent } from '../../shared/load-button/load-button.component';
import { SuccessModalComponent } from '../../shared/modals/success-modal/success-modal.component';

@Component({
  selector: 'event-form',
  imports: [ReactiveFormsModule, EncodeBase64Directive, ValidationClassesDirective,
    DatePipe, GaAutocompleteDirective, OlMapDirective, OlMarkerDirective, LoadButtonComponent],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})

export class EventFormComponent implements CanComponentDeactivate {
  @ViewChild('addForm', { static: true }) addForm!: NgForm;

  constructor() {
    effect(() => {
      this.editMode();
      if (this.isEditMode()) {
        this.#title.setTitle(this.event()!.title + ' | Angular Events');
        this.eventForm.patchValue({
          title: this.event().title,
          date: this.event().date.split(' ')[0],
          description: this.event().description,
          price: this.event().price,
        });
        this.address.set(this.event().address);
        this.imageBase64 = this.event().image!;
        this.coordinates.set([this.event().lng, this.event().lat]);
      }

    });
  }

  #title = inject(Title);
  #route = inject(ActivatedRoute);
  #fb = inject(NonNullableFormBuilder);
  minDate = new Date().toISOString().split('T')[0];
  coordinates = signal<[number, number]>([-0.5, 38.5]);
  address = signal<string>('');
  event = input.required<MyEvent>();
  isEditMode = signal<boolean>(false);
  #modalService = inject(NgbModal);
  loading = signal<boolean>(false);

  eventForm = this.#fb.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-Z][a-zA-Z ]*$')]],
    date: ['', [Validators.required, minDateValidator(this.minDate)]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    image: ['', [Validators.required]]
  });

  imageBase64 = '';

  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #saved = false;

  editMode() {
    this.#route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && this.event().mine) {
        this.isEditMode.set(true);
      } else if (id && !this.event().mine) {
        this.#router.navigate(['/events']);
      } else {
        this.isEditMode.set(false);
      }
    });
  }

  canDeactivate() {
    if (this.#saved || (this.addForm && this.addForm.pristine)) {
      return true;
    }
    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Changes not saved';
    modalRef.componentInstance.body = 'Do you want to leave the page?';
    return modalRef.result.catch(() => false);
  }

  addEvent() {
    if (this.isEditMode()) {
      setTimeout(() => {
        this.loading.set(true);
        const imageToSend = this.imageBase64.startsWith('data:image') ? this.imageBase64 : this.event().image;

        this.#eventsService
          .updateEvent(this.event().id, {
            ...this.eventForm.getRawValue(),
            image: imageToSend,
            lat: this.coordinates()[1],
            lng: this.coordinates()[0],
            address: this.address()
          })
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe({
            next: () => {
              this.#saved = true;
              const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
              modalRefSuccess.componentInstance.title = 'Event Updated';
              modalRefSuccess.componentInstance.body = 'Your event has been updated successfully!';
              setTimeout(() => {
                modalRefSuccess.close();
                this.#router.navigate([`/events/${this.event().id}`]);
              }, 1500);
            },
            error: (error) => {
              console.error(error);
              this.loading.set(false);
              const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
              modalRefSuccess.componentInstance.title = 'Error';
              modalRefSuccess.componentInstance.body = 'There was an error updating the event. Please try again.';
            }
          });
      }, 2500);
    } else {
      setTimeout(() => {
        this.loading.set(true);
        this.#eventsService
          .insertEvent({
            ...this.eventForm.getRawValue(),
            image: this.imageBase64,
            lat: this.coordinates()[1],
            lng: this.coordinates()[0],
            address: this.address()
          })
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe({
            next: () => {
              this.#saved = true;
              const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
              modalRefSuccess.componentInstance.title = 'Event Created';
              modalRefSuccess.componentInstance.body = 'Your event has been created successfully!';
              setTimeout(() => {
                modalRefSuccess.close();
                this.#router.navigate(['/events']);
              }, 1500);
            },
            error: (error) => {
              console.error(error);
              this.loading.set(false);
              const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
              modalRefSuccess.componentInstance.title = 'Error';
              modalRefSuccess.componentInstance.body = 'There was an error creating the event. Please try again.';
            }
          });
      }, 2500);
    }
  }

  changePlace(result: SearchResult) {
    this.coordinates.set(result.coordinates);
    this.address.set(result.address);
  }
}
