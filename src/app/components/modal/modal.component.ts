import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Output() close = new EventEmitter<void>();
  @Input() showCloseBtn?:boolean = false;

  closeModal() {
    this.close.emit();
  }
}
