import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent {
  @Input() label: string = '';
  @Input() options: any[] = [];
  @Input() value: any = null;
  @Input() controlName: string = '';
  @Input() form!: FormGroup;
  @Input() required?: boolean;
  @Input() errorMessage?: string;
  @Input() submitted: boolean = false;
  @Input() isDisabled: boolean = false;

  @Output() changeEvent = new EventEmitter<any>();

  isInvalid(): boolean {
    const control = this.form.get(this.controlName);
    return (
      control !== null && control.invalid && (control.touched || this.submitted)
    );
  }
}
