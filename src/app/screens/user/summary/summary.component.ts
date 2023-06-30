import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toasterService/toaster.service';
import { SummaryApisService } from 'src/app/services/user/summary-apis.service';
import { UtilsService } from 'src/app/utilities/utils.service';

interface statusCountsProp {
  Loans: number;
  Submitted: number;
  Draft: number;
  InComplete: number;
  Approved: number;
  Completed: number;
  Rejected: number;
}
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  headers: string[] = [
    'Mobile',
    'Staff name',
    'Email',
    'Date',
    'Loan id',
    'Amount',
    'Status',
    'Action',
  ];
  tableData: any = [];
  message: string = '';
  severity: 'success' | 'error' = 'success';
  loader: boolean = false;
  statusCounts?: statusCountsProp;
  count: number;
  search: string;
  startDate: string;
  endDate: string;
  page: number;
  size: number;
  submitted: boolean;

  constructor(
    private router: Router,
    private apiService: SummaryApisService,
    private utils: UtilsService,
    private toastService: ToasterService
  ) {
    this.count = 0;
    this.search = '';
    this.startDate = this.utils.fetchTodaysDate();
    this.endDate = this.utils.fetchTodaysDate();
    this.size = 5;
    this.page = 1;

    this.submitted = false;
  }

  ngOnInit() {
    const data = {
      search: this.search,
      startDate: this.startDate,
      endDate: this.endDate,
    };

    this.fetchUserLoansStatusCount(data);
  }

  onInputChanged(data: any): void {
    data?.name === 'search'
      ? (this.search = data?.value)
      : data?.name === 'startDate'
      ? (this.startDate = data?.value)
      : data?.name === 'endDate'
      ? (this.endDate = data?.value)
      : null;
  }

  resetFields(): void {
    this.search = '';
    this.startDate = this.utils.fetchTodaysDate();
    this.endDate = this.utils.fetchTodaysDate();
    this.size = 5;
    this.page = 1;
    const data = {
      search: this.search,
      startDate: this.startDate,
      endDate: this.endDate,
    };

    this.fetchUserLoansStatusCount(data);
  }

  clearFields(): void {
    this.search = '';
    this.startDate = '';
    this.endDate = '';
    this.size = 5;
    this.page = 1;
    this.count = 100
    this.statusCounts = {
      Loans: 0,
      Submitted: 0,
      Draft: 0,
      InComplete: 0,
      Approved: 0,
      Completed: 0,
      Rejected: 0,
    };
    this.count = 0;
    this.tableData = [];
  }

  handleValidation(): boolean {
    if (!this.search && !this.startDate && !this.endDate) {
      this.handleToaster({
        message: 'Please set required fields',
        severity: 'error',
      });
      return false;
    }

    if (this.search && !this.startDate && !this.endDate) {
      return true;
    }

    if (
      (this.search && !this.startDate && this.endDate) ||
      (this.search && this.startDate && !this.endDate) ||
      (!this.search && !this.startDate && this.endDate) ||
      (!this.search && this.startDate && !this.endDate)
    ) {
      this.handleToaster({
        message: 'Please select dates',
        severity: 'error',
      });
      return false;
    }
    return true;
  }

  checkIsDatesValid(): boolean {
    if (
      this.startDate &&
      this.endDate &&
      new Date(this.startDate) > new Date(this.endDate)
    ) {
      this.handleToaster({
        message: 'start Date should not be greater than end date',
        severity: 'error',
      });
      return false;
    }
    return true;
  }

  handleFilter(): void {
    if (!this.handleValidation() || !this.checkIsDatesValid()) {
      return;
    }
    const data = {
      search: this.search,
      startDate: this.startDate,
      endDate: this.endDate,
    };

    this.fetchUserLoansStatusCount(data);
  }

  updateSize(size: any): void {
    this.size = parseInt(size);
  }

  updatePage(page: any): void {
    this.page = parseInt(page);
  }

  fetchUserLoansStatusCount(data: {
    search: string;
    startDate: string;
    endDate: string;
  }) {
    const updatedData = { userId: 3, ...data };
    this.loader = true;
    this.apiService.fetchUserLoansStatusCount(updatedData).subscribe({
      next: (data: any) => {
        this.statusCounts = data;
        this.fetchUserLoans({
          ...updatedData,
          page: this.page,
          size: this.size,
        });
        this.loader = false;
      },
      error: (err: HttpErrorResponse) => {
        this.severity = 'error';
        this.message = err?.error;
        this.toastService.showToaster();
        this.loader = false;
        this.resetFields();
      },
      complete: () => {},
    });
  }

  fetchUserLoans(data: {
    search: string;
    startDate: string;
    endDate: string;
    page: number;
    size: number;
  }) {
    if (!this.handleValidation()) {
      return;
    }

    this.loader = true;
    const updatedData = { userId: 3, ...data };

    this.apiService.fetchUserLoans(updatedData).subscribe({
      next: (res: any) => {
        this.count = res?.count;
        this.tableData = res?.loans;
        this.loader = false;
      },
      error: (err: HttpErrorResponse) => {
        this.severity = 'error';
        this.message = err?.error?.message;
        this.toastService.showToaster();
        this.loader = false;
      },
      complete: () => {},
    });
  }

  handleNewApplication() {
    this.router.navigate(['/loan-application']);
  }


  handleToaster(data: any) {
    const { message, severity } = data;
    this.message = message;
    this.severity = severity;
    this.toastService.showToaster();
  }
}
