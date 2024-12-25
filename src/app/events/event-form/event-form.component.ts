import { Component, DestroyRef, inject, signal, input, effect } from '@angular/core';
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

@Component({
  selector: 'event-form',
  standalone: true,
  imports: [ReactiveFormsModule, EncodeBase64Directive, ValidationClassesDirective,
    DatePipe, GaAutocompleteDirective, OlMapDirective, OlMarkerDirective],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})

export class EventFormComponent implements CanComponentDeactivate {
  constructor() {
    effect(() => {
      if (this.isEditMode()) {
      this.#title.setTitle(this.event()!.title + ' | Angular Events');
      this.eventForm.patchValue({
				title: this.event().title,
				date: this.event().date,
        description: this.event().description,
        price: this.event().price,
        image: this.event().image,
      });
      console.log(this.event());
      }
      this.editMode();
    }, { allowSignalWrites: true });
  }

  #title = inject(Title);
  #route = inject(ActivatedRoute);
  #fb = inject(NonNullableFormBuilder);
  minDate = '2024-12-02';
  coordinates = signal<[number, number]>([-0.5, 38.5]);
  address = signal<string>('');
  event = input.required<MyEvent>();
  isEditMode = signal<boolean>(false);

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
      if (id) {
        this.isEditMode.set(true);
        console.log(this.isEditMode());
      } else {
        this.isEditMode.set(false);
        console.log(this.isEditMode());
      }
    });
  }

  canDeactivate() {
    return (
      this.eventForm.pristine ||
      this.#saved ||
      confirm('¿Quieres abandonar la página?. Los cambios se perderán...')
    );
  }

  addEvent() {
    this.#eventsService
      .insertEvent({
        ...this.eventForm.getRawValue(),
        image: this.imageBase64,
        lat: this.coordinates()[1],
        lng: this.coordinates()[0],
        address: this.address()
      })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#saved = true;
        this.#router.navigate(['/events']);
      });
  }

  changePlace(result: SearchResult) {
    this.coordinates.set(result.coordinates);
    this.address.set(result.address);
    console.log(result.address); // Habría que guardarlo
  }
}
