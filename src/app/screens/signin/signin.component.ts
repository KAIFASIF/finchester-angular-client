import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { SigninApiService } from 'src/app/services/signin/signin-api.service';
import { ToasterService } from 'src/app/services/toasterService/toaster.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  message: string = '';
  severity: 'success' | 'error' = 'success';
  submitted: boolean = false;
  loader: boolean = false;

  formFields: any = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      rules: { required: true },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      rules: { required: true },
    },
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: SigninApiService,
    private router: Router,
    private sharedService: SharedService,
    private toasterService: ToasterService
  ) {
    this.signinForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.formFields = this.formFields.map((field: any) => {
      const control = this.fb.control(
        field.value,
        this.getValidators(field?.rules)
      );
      this.signinForm.addControl(field.name, control);
      return field;
    });
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
      const control = this.signinForm.get(field.name);
      if (control !== null && control?.errors?.['required']) {
        return '*This field is required';
      }
    }
    return '*Invalid format';
  }

  onSubmit() {
    this.submitted = true;
    if (this.signinForm.valid) {
      this.loader = true;
      this.apiService.postsigninDetails(this.signinForm.value).subscribe({
        next: (res: any) => {
          localStorage.setItem('token', JSON.stringify(res?.token));
          this.sharedService.partnerId = res?.partnerId;
          this.sharedService.role = res?.role;
          this.sharedService.user = res?.user;
          this.sharedService.partnerName = res?.partnerName;
          this.loader = false;
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          if (err?.status === 404) {
            this.severity = 'error';
            this.message = err?.error?.message;
            this.toasterService.showToaster();
          }
          this.loader = false;
        },
      });
    }
  }
}
