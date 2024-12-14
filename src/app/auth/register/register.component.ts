import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { MyGeolocation } from "../../shared/classes/my-geolocation";
import { Coordinates } from "../../shared/interfaces/coordinates";
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { equalValues } from '../../shared/validators/equal-values.validator';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { AuthService } from '../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'register',
    standalone: true,
    imports: [ReactiveFormsModule, ValidationClassesDirective, EncodeBase64Directive],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, CanComponentDeactivate {
  #router = inject(Router);
  coords: Coordinates = { latitude: 0, longitude: 0 };
  #fb = inject(NonNullableFormBuilder);
  #saved = false;
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);

  registerForm = this.#fb.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      email2: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
      avatar: ['', [Validators.required]]
    },
    {
      validators: equalValues('email', 'email2')
    }
  );

  imageBase64 = '';

  async ngOnInit() {
    try {
      const pos = await MyGeolocation.getLocation();
      this.coords.latitude = pos.latitude;
      this.coords.longitude = pos.longitude;
      this.registerForm.patchValue({
        lat: this.coords.latitude.toString(),
        lng: this.coords.longitude.toString()
      });
      console.log(pos);
      console.log(this.coords);
    } catch (error) {
      console.error(error, "Geolocalization is unavailable");
    }
  }

  registerUser() {
    this.#authService
      .register({
        ...this.registerForm.getRawValue(),
        avatar: this.imageBase64,
        lat: parseFloat(this.registerForm.getRawValue().lat),
        lng: parseFloat(this.registerForm.getRawValue().lng),
      })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#saved = true;
        this.#router.navigate(['/auth/login']);
      });
  }

  goBack() {
    this.#router.navigate(['/auth/login']);
  }

  canDeactivate() {
    return (
      this.registerForm.pristine ||
      this.#saved ||
      confirm('¿Quieres abandonar la página?. Los cambios se perderán...')
    );
  }
}