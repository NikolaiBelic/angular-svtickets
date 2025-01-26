import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'success-modal',
    templateUrl: './success-modal.component.html',
    styleUrls: ['./success-modal.component.css'],
    standalone: false
})
export class SuccessModalComponent {
  title: string = '';
  body: string = '';

  constructor(public activeModal: NgbActiveModal) {}
}