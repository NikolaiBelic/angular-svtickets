import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, of, catchError } from 'rxjs';
import { User, UserLogin } from '../interfaces/UserAuth';
import { SingleUserResponse, TokenResponse } from '../interfaces/responses';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    #authUrl = 'auth';
    #http = inject(HttpClient);
    #logged = signal<boolean>(!!localStorage.getItem('token'));

    get logged() {
        return this.#logged.asReadonly();
    }

    login(data: UserLogin): Observable<void> {
        return this.#http
            .post<TokenResponse>(`${this.#authUrl}/login`, data)
            .pipe(
                map((resp) => {
                    localStorage.setItem('token', resp.accessToken);
                    this.#logged.set(true);
                })
            );
    }

    loginGoogle(token: string): Observable<void> {
        return this.#http
            .post<TokenResponse>(`${this.#authUrl}/google`, { token })
            .pipe(
                map((resp) => {
                    localStorage.setItem('token', resp.accessToken);
                    this.#logged.set(true);
                })
            );
    }

    loginFacebook(token: string): Observable<void> {
        return this.#http
            .post<TokenResponse>(`${this.#authUrl}/facebook`, { token })
            .pipe(
                map((resp) => {
                    localStorage.setItem('token', resp.accessToken);
                    this.#logged.set(true);
                })
            );
    }

    logout(): void {
        localStorage.removeItem('token');
        this.#logged.set(false);
    }

    isLogged(): Observable<boolean> {
        const token = localStorage.getItem('token');
        if (!this.#logged() && !token) {
            return of(false);
        } else if (this.#logged()) {
            return of(true);
        } else {
            return this.#http
                .get<boolean>(`${this.#authUrl}/validate`)
                .pipe(
                    map(() => {
                        this.#logged.set(true);
                        return true;
                    }),
                    catchError(() => {
                        localStorage.removeItem('token');
                        return of(false);
                    })
                );
        }
    }

    register(userInfo: User): Observable<User> {
        return this.#http
            .post<SingleUserResponse>(`${this.#authUrl}/register`, userInfo)
            .pipe(map((resp) => resp.user ));
    }

}
