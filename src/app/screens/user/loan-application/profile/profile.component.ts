import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  @Input() config: any;
  @Input() profileDetail: any;
  profileConfig: any[];
  profileForm: FormGroup;
  formFields: any[];
  submitted: boolean = false;
  @Input() disabled: boolean = false;
  @Output() handleToggle = new EventEmitter<number>();
  @Output() updateProfileDetails = new EventEmitter<any>();
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
    this.profileForm = this.fb.group({
      id: [null],
    });
    this.profileConfig = [];
    this.formFields = [];
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && changes['config'].currentValue) {
      this.profileConfig = JSON.parse(
        changes['config']?.currentValue?.config
      )[0]?.profileConfig;
    }
    if (changes['profileDetail'] && changes['profileDetail'].currentValue) {
      this.handleRenderFields(
        this.profileConfig,
        changes['profileDetail'].currentValue
      );
    }
    if (!changes['profileDetail']?.currentValue) {
      this.handleRenderFields(this.profileConfig, null);
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
      const control = this.profileForm.get(field.name);
      if (control !== null && control?.errors?.['required']) {
        return '*This field is required';
      }
    }
    return '*Invalid format';
  }

  handleRenderFields(configObj: any, profileDetails: any) {
    const mobileRegx = /^[6-9]{1}[0-9]{9}$/;
    if (profileDetails && mobileRegx.test(profileDetails)) {
      const arr = configObj
        .map((ele: any) =>
          ele?.name === 'mobile' ? { ...ele, value: profileDetails } : ele
        )
        .filter((ele: any) => ele?.render);
      this.formFields = arr.map((field: any) => {
        const control = this.fb.control(
          field.value,
          this.getValidators(field?.rules)
        );
        this.profileForm.addControl(field.name, control);
        return field;
      });
    } else {
      this.profileForm.get('id')?.setValue(profileDetails?.id);
      this.sharedService.profileId = profileDetails?.id;
      const additionalFields = JSON.parse(profileDetails?.additionalFields);
      const profileDetailObj = { ...profileDetails, ...additionalFields };
      const newArr = configObj
        .map((ele: any) =>
          profileDetailObj.hasOwnProperty(ele?.name)
            ? { ...ele, render: true, value: profileDetailObj[ele?.name] }
            : null
        )
        .filter((item: any) => item !== null);

      this.formFields = newArr.map((field: any) => {
        const control = this.fb.control(
          field.value,
          this.getValidators(field?.rules)
        );
        this.profileForm.addControl(field.name, control);
        return field;
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.profileForm.valid) {
      const data = this.profileForm.value;

      const {
        id,
        mobile,
        email,
        fullname,
        residence,
        address,
        city,
        pincode,
        ...rest
      } = data;
      const updatedData = {
        id,
        mobile,
        email,
        fullname,
        residence,
        address,
        city,
        pincode,
        additionalFields: JSON.stringify(rest),
      };

      if (this.sharedService?.partnerId) {
        this.handleLoader.emit(true);
        this.apiService
          .postProfileDetails(
            this.sharedService?.partnerId,
            this.sharedService?.user?.id,
            updatedData
          )
          .subscribe({
            next: (res: any) => {
              this.updateProfileDetails.emit(res);
              this.profileDetail = res;
              this.sharedService.profileId = res?.id;
              this.handleToggle.emit(1);
              this.handleLoader.emit(false);
            },
            error: (err: HttpErrorResponse) => {
              this.handleToaster.emit({
                message: err?.error,
                severity: 'error',
              });
              this.handleLoader.emit(false);
            },
            complete: () => {},
          });
      }
    }
  }

  handleDependentFields(name: String, value: HTMLInputElement) {
    if (name && value) {
      const dependentArray = this.profileConfig.filter(
        (ele: any) =>
          ele?.dependentFieldName && ele?.dependentFieldName === name
      );

      dependentArray.forEach((field: any) => {
        this.profileForm.removeControl(field.name);
      });

      const filteredArray: any =
        this.profileConfig.length > 0 &&
        this.profileConfig.filter(
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
          this.profileForm.addControl(field.name, control);
          return field;
        }
      );
    }
  }
}
