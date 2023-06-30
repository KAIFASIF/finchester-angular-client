import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loan-counts',
  templateUrl: './loan-counts.component.html',
  styleUrls: ['./loan-counts.component.css']
})
export class LoanCountsComponent {
  @Input() statusCounts?:any

}
