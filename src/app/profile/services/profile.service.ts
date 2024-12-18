import { User, UserProfileEdit, UserPasswordEdit, UserPhotoEdit } from '../interfaces/user';
import { SingleUserResponse } from '../interfaces/responses';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    #profileUrl = 'users';
    #http = inject(HttpClient);

    getProfile(id?: number): Observable<User> {
        if (!id) {
            return this.#http
                .get<SingleUserResponse>(`${this.#profileUrl}/me`)
                .pipe(map((resp) => resp.user));
        } else {
        return this.#http
            .get<SingleUserResponse>(`${this.#profileUrl}/${id}`)
            .pipe(map((resp) => resp.user));
        }
    }

    saveProfile(name: string, email: string): Observable<void> {
        return this.#http.put<void>(`${this.#profileUrl}/me`, { name, email });
    }

    savePassword(password: string): Observable<void> {
        return this.#http.put<void>(`${this.#profileUrl}/me/password`, { password });
    }

    saveAvatar(avatar: string): Observable<string> {
        return this.#http.put<UserPhotoEdit>(`${this.#profileUrl}/me/photo`, { avatar })
            .pipe(map((resp) => resp.avatar));
    }
}