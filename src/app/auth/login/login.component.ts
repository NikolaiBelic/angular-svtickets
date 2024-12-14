import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { Coordinates } from "../../shared/interfaces/coordinates";
import { MyGeolocation } from "../../shared/classes/my-geolocation";
import { AuthService } from '../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from '../../shared/modals/success-modal/success-modal.component';
import { ErrorModalComponent } from '../../shared/modals/error-modal/error-modal.component';

@Component({
  selector: 'login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, ValidationClassesDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  #fb = inject(NonNullableFormBuilder);
  coords: Coordinates = { latitude: 0, longitude: 0 };
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #modalService = inject(NgbModal);

  loginForm = this.#fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    }
  );

  async ngOnInit() {
    try {
      const pos = await MyGeolocation.getLocation();
      this.coords.latitude = pos.latitude;
      this.coords.longitude = pos.longitude;
      console.log(pos);
      console.log(this.coords);
    } catch (error) {
      console.error(error, "Geolocalization is unavailable");
    }
  }

  loginUser() {
    this.#authService
      .login({
        ...this.loginForm.getRawValue(),
        lat: this.coords.latitude,
        lng: this.coords.longitude
      })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
          setTimeout(() => {
            modalRefSuccess.close();
            this.#router.navigate(['/events']);
          }, 1500);
        },
        error: (error) => {
          console.error(error);
          const modalRefError = this.#modalService.open(ErrorModalComponent);
          setTimeout(() => {
            modalRefError.close();
          }, 1500);
        }
      });
  }
}
