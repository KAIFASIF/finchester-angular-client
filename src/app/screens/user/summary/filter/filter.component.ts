import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { UtilsService } from 'src/app/utilities/utils.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  filterForm: FormGroup;
  formFields: any = [];
  @Input() search: string = '';
  @Input() startDate: string = '';
  @Input() endDate: string = '';
  @Input() size: number = 0;
  @Input() page: number = 1;
  @Input() submitted: boolean = false;
  @Output() inputChanged = new EventEmitter<{
    name: string;
    value: any;
  }>();
  @Output() clearEvent = new EventEmitter<any>();
  @Output() resetEvent = new EventEmitter<any>();
  @Output() filterEvent = new EventEmitter<any>();

  constructor(private fb: FormBuilder, utils: UtilsService) {
    this.filterForm = this.fb.group({});
  }

  ngOnInit() {
    const filedsArray = [
      {
        name: 'search',
        type: 'text',
        placeholder: 'search by status or mobile...',
        rules: { required: false },
      },
      {
        name: 'startDate',
        type: 'date',
        value: this.startDate,
        rules: { required: true },
      },
      {
        name: 'endDate',
        type: 'date',
        value: this.endDate,
        rules: { required: true },
      },
    ];

    this.handleRenderedFields(filedsArray);
  }

  onInputChanged(data: { name: string; value: any }) {
    this.inputChanged.emit(data);
  }

  private getValidators(ele: any): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (ele.required) {
      validators.push(Validators.required);
    }
    if (ele.pattern) {
      validators.push(Validators.pattern(eval(ele.pattern)));
    }
    return validators;
  }

  handleRenderedFields(configObj: any) {
    this.formFields = configObj.map((field: any) => {
      const control = this.fb.control(
        field.value,
        this.getValidators(field?.rules)
      );
      this.filterForm.addControl(field.name, control);
      return field;
    });
  }

  handleClearFilters() {
    this.clearEvent.emit();
  }

  handleReset() {
    this.resetEvent.emit();
  }
  getErrorMessage(field: any): string {
    if (field?.rules?.required && this.submitted) {
      const control = this.filterForm.get(field.name);
      if (control !== null && control?.errors?.['required']) {
        return '*This field is required';
      }
    }
    return '*Invalid format';
  }

  onSubmit() {
    if (this.filterForm.valid) {
      this.filterEvent.emit();
    }
  }
}
