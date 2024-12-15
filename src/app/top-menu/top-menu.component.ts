import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
    selector: 'top-menu',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './top-menu.component.html',
    styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  #authService = inject(AuthService);
  #router = inject(Router);

  isLogged = computed(() => this.#authService.logged());

  ngOnInit() {
      console.log('User is logged in:', this.isLogged());
  }

  logout() {
    this.#authService.logout();
    this.#router.navigate(['/auth/login']);
  }
}