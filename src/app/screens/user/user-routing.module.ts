import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanApplicationComponent } from './loan-application/loan-application.component';
import { AuthGuard } from 'src/app/services/auth.guard';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [
  { path: '', component: SummaryComponent, canActivate:[AuthGuard] },
  { path: 'loan-application', component: LoanApplicationComponent, canActivate:[AuthGuard] },
  { path: 'loan-application/:loanId', component: LoanApplicationComponent,  canActivate:[AuthGuard]},
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
