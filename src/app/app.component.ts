import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TopMenuComponent } from './top-menu/top-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopMenuComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./../styles.css']
})
export class AppComponent {
  title = 'angular-svtickets';
}
