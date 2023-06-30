import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { LoanApplicationApisService } from 'src/app/services/user/loan-application-apis.service';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css'],
})
export class LoanComponent {
  @Input() config: any;
  @Input() loanDetail: any;
  @Input() disabled: boolean = false;
  @Output() updateLoanDetails = new EventEmitter<any>();
  @Output() handleLoader = new EventEmitter<boolean>();
  @Output() handleToaster = new EventEmitter<{
    message: string;
    severity: 'error' | 'success';
  }>();
  loanConfig: any[];
  loanForm: FormGroup;
  formFields: any = [];
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private apiService: LoanApplicationApisService,
    private router: Router
  ) {
    this.loanForm = this.fb.group({ id: [null], loanId: [null] });
    this.loanConfig = [];
    this.formFields = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && changes['config'].currentValue) {
      this.loanConfig = JSON.parse(
        changes['config']?.currentValue?.config
      )[0]?.loanConfig;
    }
    if (changes['loanDetail'] && changes['loanDetail'].currentValue) {
      this.handleRenderFields(
        this.loanConfig,
        changes['loanDetail'].currentValue
      );
    }
    if (!changes['loanDetail']?.currentValue) {
      this.handleRenderFields(this.loanConfig, null);
    }
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

  getErrorMessage(field: any): string {
    if (field?.rules?.required && this.submitted) {
      const control = this.loanForm.get(field.name);
      if (control !== null && control?.errors?.['required']) {
        return '*This field is required';
      }
    }
    return '*Invalid format';
  }

  handleRenderFields(configObj: any, loanDetails: any) {
    if (loanDetails && Object.keys(loanDetails).length > 0) {
      this.loanForm.get('id')?.setValue(loanDetails?.id);
      this.loanForm.get('loanId')?.setValue(loanDetails?.loanId);
      const additionalFields = JSON.parse(loanDetails?.additionalFields);
      const loanDetailObj = { ...loanDetails, ...additionalFields };
      const newArr = configObj
        .map((ele: any) =>
          loanDetailObj.hasOwnProperty(ele?.name)
            ? { ...ele, render: true, value: loanDetailObj[ele?.name] }
            : null
        )
        .filter((item: any) => item !== null);

      this.formFields = newArr.map((field: any) => {
        const control = this.fb.control(
          field.value,
          this.getValidators(field?.rules)
        );
        this.loanForm.addControl(field.name, control);
        return field;
      });
    } else {
      const filteredArray = configObj.filter((ele: any) => ele?.render);
      this.formFields = filteredArray.map((field: any) => {
        const control = this.fb.control(
          field.value,
          this.getValidators(field?.rules)
        );
        this.loanForm.addControl(field.name, control);
        return field;
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.loanForm.valid) {
      const data = this.loanForm.value;
      const {
        id,
        loanId,
        reason,
        jobType,
        companyName,
        monthlyIncome,
        loanAmount,
        loanTenure,
        ...rest
      } = data;
      const updatedData = {
        id,
        loanId,
        reason,
        jobType,
        companyName,
        monthlyIncome,
        isLoanActive: true,
        status: 'Submitted',
        loanAmount: parseInt(loanAmount),
        loanTenure: parseInt(loanTenure),
        additionalFields: JSON.stringify(rest),
      };

      if (this.sharedService?.partnerId) {
        this.handleLoader.emit(true)
        this.apiService
          .postLoanDetails(
            this.sharedService?.partnerId,
            this.sharedService?.user?.id,
            this.sharedService?.profileId,
            updatedData
          )
          .subscribe({
            next: (res: any) => {
              this.updateLoanDetails.emit(res);
              this.router.navigate([`/loan-application/${res?.loanId}`], {
                queryParams: { status: res?.status },
              });
              this.handleLoader.emit(false)
            },
            error: (err: any) => {
              this.handleToaster.emit({
                message: err?.error,
                severity: 'error',
              });
              this.handleLoader.emit(false)
            },
          });
      }
    }
  }

  handleDependentFields(name: String, value: HTMLInputElement) {
    if (name && value) {
      const dependentArray = this.loanConfig.filter(
        (ele: any) =>
          ele?.dependentFieldName && ele?.dependentFieldName === name
      );

      dependentArray.forEach((field: any) => {
        this.loanForm.removeControl(field.name);
      });

      const filteredArray: any =
        this.loanConfig.length > 0 &&
        this.loanConfig.filter(
          (ele: any) =>
            ele?.dependentFieldName &&
            ele?.dependentFieldName === name &&
            ele?.dependentFieldValue &&
            ele?.dependentFieldValue.includes(value)
        );

      const fieldsRemoved = this.formFields.filter((ele: any) =>
        dependentArray.length > 0
          ? dependentArray.some(
              (item: any) =>
                ele?.dependentFieldName !== item?.dependentFieldName
            )
          : true
      );

      this.formFields = [...fieldsRemoved, ...filteredArray].map(
        (field: any) => {
          const control = this.fb.control(
            field.value,
            this.getValidators(field?.rules)
          );
          this.loanForm.addControl(field.name, control);
          return field;
        }
      );
    }
  }
}
