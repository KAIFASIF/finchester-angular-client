import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary-table',
  templateUrl: './summary-table.component.html',
  styleUrls: ['./summary-table.component.css'],
})
export class SummaryTableComponent {
  @Input() headers: string[] = [];
  @Input() tableData: any;

  constructor(private router: Router) {}

  naviagteToLoanApplication(loanId: string, status: string) {
    this.router.navigate([`/loan-application/${loanId}`], {
      queryParams: { status: status },
    });
  }
}
