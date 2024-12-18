import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { catchError, EMPTY } from 'rxjs';
import { User } from '../interfaces/user';

export const profileResolver: ResolveFn<User> = (route) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  const id = route.paramMap.get('id')!;

  if (!id) {
    return profileService.getProfile();
  } else {
    return profileService.getProfile(+id).pipe(
      catchError(() => {
        router.navigate(['/events']);
        return EMPTY;
      })
    );
  }
};