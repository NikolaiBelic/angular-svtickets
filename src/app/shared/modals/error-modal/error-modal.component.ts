import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'error-modal',
    templateUrl: './error-modal.component.html',
    styleUrl: './error-modal.component.css',
    standalone: false
})
export class ErrorModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}