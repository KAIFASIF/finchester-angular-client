import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { LoanApplicationApisService } from 'src/app/services/user/loan-application-apis.service';

@Component({
  selector: 'app-mobile-modal',
  templateUrl: './mobile-modal.component.html',
  styleUrls: ['./mobile-modal.component.css'],
})
export class MobileModalComponent implements OnInit {
  @Output() handleMobileModal = new EventEmitter<boolean>();
  @Output() renderFetchedDetails = new EventEmitter<any>();
  submitted: boolean = false;
  mobileForm: FormGroup;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: LoanApplicationApisService,
    private router: Router
  ) {
    this.mobileForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  ngOnInit(): void {
    const control = this.mobileForm.get('mobile');
    if (control) {
      control.valueChanges
        .pipe(debounceTime(500), takeUntil(this.unsubscribe$))
        .subscribe((value: string) => {
          if (value.length > 9) {
            this.onSubmit();
          }
        });
    }
  }

  getErrorMessage(): string {
    const control = this.mobileForm.get('mobile');
    if (control !== null && control.errors?.['required'] && this.submitted) {
      return '*This field is required';
    }
    return '*Invalid format';
  }

  onSubmit() {
    this.submitted = true;
    if (this.mobileForm.valid) {
      const mobileNumber = this.mobileForm.get('mobile')?.value;
      this.apiService.searchDetailsByMobile(parseInt(mobileNumber)).subscribe({
        next: (data: any) => {
          this.renderFetchedDetails.emit({
            profileDetail: data?.profileDetail,
            bankDetail: data?.bankDetail,
            loanDetail: data?.activeLoan,
          });
          if (Object.keys(data?.activeLoan).length > 0) {
            this.router.navigate(
              [`/loan-application/${data?.activeLoan?.loanId}`],
              { queryParams: { status: data?.activeLoan?.status } }
            );
            return;
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err?.status === 404) {
            this.renderFetchedDetails.emit({
              profileDetail: String(mobileNumber),
              bankDetail: null,
              loanDetail: null,
            });
          }
        },
        complete: () => {},
      });
    }
  }
}
