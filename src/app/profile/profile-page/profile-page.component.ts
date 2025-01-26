import { Component, effect, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { User } from '../interfaces/user';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';
import { ProfileService } from '../services/profile.service';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { equalValues } from '../../shared/validators/equal-values.validator';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from '../../shared/modals/success-modal/success-modal.component';

@Component({
	selector: 'profile-page',
	imports: [OlMapDirective, OlMarkerDirective, ReactiveFormsModule, ValidationClassesDirective, EncodeBase64Directive, RouterLink, FontAwesomeModule],
	templateUrl: './profile-page.component.html',
	styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
	#title = inject(Title);
	user = input.required<User>();
	coordinates = signal<[number, number]>([0, 0]);
	editingProfile = signal<boolean>(false);
	editingPassword = signal<boolean>(false);
	#profileService = inject(ProfileService);
	#fb = inject(NonNullableFormBuilder);
	imageBase64 = signal<string>('');
	#modalService = inject(NgbModal);

	faImage = faImage;

	editProfileForm = this.#fb.group(
		{
			email: ['', [Validators.required, Validators.email]],
			name: ['', [Validators.required]]
		}
	);

	editPasswordForm = this.#fb.group(
		{
			password: ['', [Validators.required, Validators.minLength(4)]],
			password2: ['', [Validators.required]]
		},
		{
			validators: equalValues('password', 'password2')
		}
	);

	constructor() {
		effect(() => {
			this.#title.setTitle(this.user().name + ' | Angular Events');
			this.coordinates.set([this.user().lng, this.user().lat]);
			this.imageBase64.set(this.user().avatar);
			this.editProfileForm.patchValue({
				name: this.user().name,
				email: this.user().email
			});

		});
	}

	editProfile() {
		this.editingProfile.set(!this.editingProfile());
	}

	editPassword() {
		this.editingPassword.set(!this.editingPassword());
	}

	saveProfile() {
		this.#profileService.saveProfile(this.editProfileForm.getRawValue().name, this.editProfileForm.getRawValue().email)
			.subscribe({
				next: () => {
					this.user().name = this.editProfileForm.getRawValue().name;
					this.user().email = this.editProfileForm.getRawValue().email;
					this.editingProfile.set(false);
					const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
					modalRefSuccess.componentInstance.title = 'Profile Updated';
					modalRefSuccess.componentInstance.body = 'Your profile has been updated';
					setTimeout(() => {
						modalRefSuccess.close();
					}, 1500);
				},
				error: (err) => {
					this.editingProfile.set(false);
					const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
					modalRefSuccess.componentInstance.title = 'Error';
					modalRefSuccess.componentInstance.body = 'There was an error updating the profile. Please try again.';
					setTimeout(() => {
						modalRefSuccess.close();
					}, 1500);
					console.error('Error updating profile:', err);
				}
			});
	}

	savePassword() {
		this.#profileService.savePassword(this.editPasswordForm.getRawValue().password)
			.subscribe({
				next: () => {
					this.editingPassword.set(false);
					const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
					modalRefSuccess.componentInstance.title = 'Password Updated';
					modalRefSuccess.componentInstance.body = 'Your password has been updated';
					setTimeout(() => {
						modalRefSuccess.close();
					}, 1500);
				},
				error: (err) => {
					this.editingPassword.set(false);
					const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
					modalRefSuccess.componentInstance.title = 'Error';
					modalRefSuccess.componentInstance.body = 'There was an error updating the password. Please try again.';
					setTimeout(() => {
						modalRefSuccess.close();
					}, 1500);
					console.error('Error updating password:', err);
				}
			})
	}

	saveAvatar(image: string) {
		this.#profileService.saveAvatar(image)
			.subscribe({
				next: () => {
					this.imageBase64.set(image);
					const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
					modalRefSuccess.componentInstance.title = 'Avatar Updated';
					modalRefSuccess.componentInstance.body = 'Your avatar has been updated';
					setTimeout(() => {
						modalRefSuccess.close();
					}, 1500);
				},
				error: (err) => {
					const modalRefSuccess = this.#modalService.open(SuccessModalComponent);
					modalRefSuccess.componentInstance.title = 'Error';
					modalRefSuccess.componentInstance.body = 'There was an error updating the avatar. Please try again.';
					setTimeout(() => {
						modalRefSuccess.close();
					}, 1500);
					console.error('Error updating avatar:', err);
				}
			})
	}
}
