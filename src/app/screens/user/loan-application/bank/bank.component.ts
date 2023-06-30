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
import { SharedService } from 'src/app/services/shared.service';
import { LoanApplicationApisService } from 'src/app/services/user/loan-application-apis.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css'],
})
export class BankComponent {
  @Input() config: any;
  @Input() bankDetail: any;
  @Input() disabled: boolean = false;
  bankConfig: any[];
  bankForm: FormGroup;
  formFields: any = [];
  submitted: boolean = false;
  @Output() handleToggle = new EventEmitter<number>();
  @Output() updateBankDetails = new EventEmitter<any>();
  @Output() handleLoader = new EventEmitter<boolean>();
  @Output() handleToaster = new EventEmitter<{
    message: string;
    severity: 'error' | 'success';
  }>();

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private apiService: LoanApplicationApisService
  ) {
    this.bankForm = this.fb.group({
      id: [null],
    });
    this.bankConfig = [];
    this.formFields = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && changes['config'].currentValue) {
      this.bankConfig = JSON.parse(
        changes['config']?.currentValue?.config
      )[0]?.bankConfig;
    }
    if (changes['bankDetail'] && changes['bankDetail'].currentValue) {
      this.handleRenderFields(
        this.bankConfig,
        changes['bankDetail'].currentValue
      );
    }
    if (!changes['bankDetail']?.currentValue) {
      this.handleRenderFields(this.bankConfig, null);
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
      console.log(`field : ${field.name} : ${field?.options}`);
      const control = this.bankForm.get(field.name);
      if (control !== null && control?.errors?.['required']) {
        return '*This field is required';
      }
    }
    return '*Invalid format';
  }

  capitalizeInput(data:{name:string, value:any}): void {
    const capitalizedValue = data?.value.toUpperCase();
    this.bankForm.get('panNo')?.setValue(capitalizedValue);
  }

  fetchBankDetails(data:{name:string, value:any}): void {
    const ifscRegx = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/;
    const ifscCode = data?.value;
    if (ifscRegx.test(ifscCode)) {
      this.handleLoader.emit(true);
      this.apiService.fetchBankDetails(ifscCode).subscribe({
        next: (res: any) => {
          const { BANK, STATE, CITY, BRANCH, ...rest } = res;
          this.bankForm.get('bankName')?.setValue(BANK);
          this.bankForm.get('city')?.setValue(CITY);
          this.bankForm.get('branch')?.setValue(BRANCH);
          this.bankForm.get('state')?.setValue(STATE);
          this.handleLoader.emit(false);
        },
        error: (err: any) => {
          this.handleLoader.emit(false);
        },
      });
    }
  }

  handleRenderFields(configObj: any, bankDetails: any) {
    if (bankDetails && Object.keys(bankDetails).length > 0) {
      this.bankForm.get('id')?.setValue(bankDetails?.id);
      const additionalFields = JSON.parse(bankDetails?.additionalFields);
      const bankDetailObj = { ...bankDetails, ...additionalFields };
      const newArr = configObj
        .map((ele: any) =>
          bankDetailObj.hasOwnProperty(ele?.name)
            ? { ...ele, render: true, value: bankDetailObj[ele?.name] }
            : null
        )
        .filter((item: any) => item !== null);

      this.formFields = newArr.map((field: any) => {
        const control = this.fb.control(
          field.value,
          this.getValidators(field?.rules)
        );
        this.bankForm.addControl(field.name, control);
        return field;
      });
    } else {
      const filteredArray = configObj.filter((ele: any) => ele?.render);
      this.formFields = filteredArray.map((field: any) => {
        const control = this.fb.control(
          field.value,
          this.getValidators(field?.rules)
        );
        this.bankForm.addControl(field.name, control);
        return field;
      });
    }

    console.log(this.formFields);
  }

  onSubmit() {
    this.submitted = true;
    if (this.bankForm.valid) {
      const data = this.bankForm.value;
      const {
        id,
        accountType,
        accountNo,
        ifscCode,
        bankName,
        branch,
        city,
        state,
        aadhaarNo,
        panNo,
        ...rest
      } = data;
      const updatedData = {
        id,
        accountType,
        accountNo: parseInt(accountNo),
        ifscCode,
        bankName,
        branch,
        city,
        state,
        aadhaarNo: parseInt(aadhaarNo),
        panNo,
        additionalFields: JSON.stringify(rest),
      };

      if (this.sharedService?.partnerId) {
        if (parseInt(accountNo) !== parseInt(rest?.confirmAccountNo)) {
          this.handleToaster.emit({
            message: 'Account no did not match',
            severity: 'error',
          });
          return;
        }

        this.handleLoader.emit(true);
        this.apiService
          .postBankDetails(
            this.sharedService?.partnerId,
            this.sharedService?.user?.id,
            this.sharedService?.profileId,
            updatedData
          )
          .subscribe({
            next: (res: any) => {
              this.updateBankDetails.emit(res);
              this.handleToggle.emit(2);
              this.handleLoader.emit(false);
            },
            error: (err: any) => {
              this.handleToaster.emit({
                message: err?.error,
                severity: 'error',
              });
              this.handleLoader.emit(false);
            },
          });
      }
    }
  }

  handleDependentFields(name: String, value: HTMLInputElement) {
    if (name && value) {
      const dependentArray = this.bankConfig.filter(
        (ele: any) =>
          ele?.dependentFieldName && ele?.dependentFieldName === name
      );

      dependentArray.forEach((field: any) => {
        this.bankForm.removeControl(field.name);
      });

      const filteredArray: any =
        this.bankConfig.length > 0 &&
        this.bankConfig
          .filter(
            (ele: any) =>
              ele?.dependentFieldName &&
              ele?.dependentFieldName === name &&
              ele?.dependentFieldValue &&
              ele?.dependentFieldValue.includes(value)
          )
          .map((ele: any) => ({ ...ele, render: true }));

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
          this.bankForm.addControl(field.name, control);
          return field;
        }
      );
    }
  }
}
