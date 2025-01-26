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
import { GoogleLoginDirective } from '../google-login/google-login.directive';
import { FbLoginDirective } from '../facebook-login/fb-login.directive';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'login',
  imports: [RouterLink, ReactiveFormsModule, ValidationClassesDirective, GoogleLoginDirective,
    FbLoginDirective, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  iconFacebook = faFacebook;
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
          modalRefSuccess.componentInstance.title = 'Login Correct';
          modalRefSuccess.componentInstance.body = 'You are logged in';
          setTimeout(() => {
            modalRefSuccess.close();
            this.#router.navigate(['/events']);
          }, 1500);
        },
        error: (error) => {
          console.error(error);
          const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
          modalRefSuccess.componentInstance.title = 'Login Error';
          modalRefSuccess.componentInstance.body = 'Incorrect email or password, try again';
          setTimeout(() => {
            modalRefSuccess.close();
          }, 1500);
        }
      });
  }

  loggedGoogle(resp: google.accounts.id.CredentialResponse) {
    // Envia esto tu API
    console.log(resp.credential);
    this.#authService
      .loginGoogle(resp.credential)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
          modalRefSuccess.componentInstance.title = 'Login Correct';
          modalRefSuccess.componentInstance.body = 'You are logged in';
          setTimeout(() => {
            modalRefSuccess.close();
            this.#router.navigate(['/events']);
          }, 1500);
        },
        error: (error) => {
          console.error(error);
          const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
          modalRefSuccess.componentInstance.title = 'Login Error';
          modalRefSuccess.componentInstance.body = 'Try again';
          setTimeout(() => {
            modalRefSuccess.close();
          }, 1500);
        }
      });
  }

  loggedFacebook(resp: fb.StatusResponse) {
    // Envía esto a tu API
    console.log(resp.authResponse.accessToken);
    this.#authService
      .loginFacebook(resp.authResponse.accessToken!)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
          modalRefSuccess.componentInstance.title = 'Login Correct';
          modalRefSuccess.componentInstance.body = 'You are logged in';
          setTimeout(() => {
            modalRefSuccess.close();
            this.#router.navigate(['/events']);
          }, 1500);
        },
        error: (error) => {
          console.error(error);
          const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
          modalRefSuccess.componentInstance.title = 'Login Error';
          modalRefSuccess.componentInstance.body = 'Try again';
          setTimeout(() => {
            modalRefSuccess.close();
          }, 1500);
        }
      });
  }

  showError(error: any) {
    console.error(error);
  }
}
