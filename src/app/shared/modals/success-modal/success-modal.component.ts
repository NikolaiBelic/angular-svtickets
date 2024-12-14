import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.css']
})
export class SuccessModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}