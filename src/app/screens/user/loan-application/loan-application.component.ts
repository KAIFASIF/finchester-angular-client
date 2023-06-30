import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { ToasterService } from 'src/app/services/toasterService/toaster.service';
import { LoanApplicationApisService } from 'src/app/services/user/loan-application-apis.service';

@Component({
  selector: 'app-loan-application',
  templateUrl: './loan-application.component.html',
})
export class LoanApplicationComponent implements OnInit {
  config: any;
  profileDetail: any;
  bankDetail: any;
  loanDetail: any;
  disabled: boolean = false;
  loanId: string | null = null;
  status: string | null = null;
  isModalOpen: boolean = true;
  panel: number = 0;
  items: any[] = [];
  message: string = '';
  severity: 'success' | 'error' = 'success';
  loader: boolean = false;

  constructor(
    private apiService: LoanApplicationApisService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private toastService: ToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loanId = params['loanId'];
    });
    this.route.queryParams.subscribe((params) => {
      this.status = params['status'];
      if (
        this.status === 'Submitted' ||
        this.status === 'Rejected' ||
        this.status === 'Completed' ||
        this.status === 'Approved'
      )
        this.disabled = true;
    });

    this.fetchConfiguration();
    if (this.loanId) {
      this.isModalOpen = false;
      this.fetchDetails();
    }
  }

  fetchConfiguration(): void {
    if (this.sharedService.partnerId) {
      this.loader = true;
      this.apiService
        .fetchConfiguration(this.sharedService.partnerId)
        .subscribe({
          next: (data: any) => {
            this.config = data;
            this.initializeItems();
            this.loader = false;
          },
          error: (err: HttpErrorResponse) => {
            if (err?.status === 404) {
              this.loader = false;
              // alert(err?.error);
            }
          },
          complete: () => {},
        });
    }
  }

  handleLoader(loader: boolean) {
    this.loader = loader;
  }

  goBack() {
    this.router.navigate(['/']);
  }
  fetchDetails(): void {
    if (this.loanId) {
      this.loader = true;
      this.apiService.fetchByLoanId(this.loanId).subscribe({
        next: (data: any) => {
          this.profileDetail = data?.profileDetail;
          this.bankDetail = data?.bankDetail;
          this.loanDetail = data?.loanDetail;
          this.loader = false;
        },
        error: (err: HttpErrorResponse) => {
          if (err?.status === 404) {
            // alert(err?.error);
            this.loader = false;
          }
        },
      });
    }
  }

  initializeItems(): void {
    this.items = [
      {
        title: 'Profile details',
      },
      {
        title: 'Bank details',
      },
      {
        title: 'Loan details',
      },
    ];
  }

  toggleAccordion(index: number): void {
    this.panel = index;
  }

  updateProfileDetails(data: any): void {
    this.profileDetail = data;
  }
  updateBankDetails(data: any): void {
    this.bankDetail = data;
  }
  updateLoanDetails(data: any): void {
    this.loanDetail = data;
  }

  renderFetchedDetails(data: any) {
    this.profileDetail = data?.profileDetail;
    this.bankDetail = data?.bankDetail;
    this.loanDetail = data?.loanDetail;
    this.isModalOpen = false;
  }

  handleToaster(data: any) {
    const { message, severity } = data;
    this.message = message;
    this.severity = severity;
    this.toastService.showToaster();
  }
}
