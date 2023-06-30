import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent {
  @Input() label: string = '';
  @Input() type?: 'text' | 'password' | 'file' | 'date' = 'text';
  @Input() value: any = null;
  @Input() placeholder?: string = '';
  @Input() controlName: string = '';
  @Input() form!: FormGroup;
  @Input() required?: boolean;
  @Input() hidden?: boolean;
  @Input() pattern?: string;
  @Input() errorMessage?: string;
  @Input() submitted: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() ngClass: string = '';
  @Output() inputChanged = new EventEmitter<{ name: string; value: any }>();

  onInput(e: any): void {
    this.inputChanged.emit({ name: this.controlName, value: e?.target?.value });
  }

  isInvalid(): boolean {
    const control = this.form.get(this.controlName);
    return (
      control !== null && control.invalid && (control.touched || this.submitted)
    );
  }
}
