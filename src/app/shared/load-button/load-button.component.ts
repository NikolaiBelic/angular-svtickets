import { Component, input } from '@angular/core';

@Component({
  selector: 'load-button',
  imports: [],
  templateUrl: './load-button.component.html',
  styleUrl: './load-button.component.css'
})
export class LoadButtonComponent {
  colorClass = input('btn-primary');
  loading = input(false);
  disabled = input(false);
}