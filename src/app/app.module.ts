import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './screens/user/loan-application/profile/profile.component';
import { SummaryComponent } from './screens/user/summary/summary.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { LoanApplicationComponent } from './screens/user/loan-application/loan-application.component';
import { ModalComponent } from './components/modal/modal.component';
import { MobileModalComponent } from './screens/user/loan-application/mobile-modal/mobile-modal.component';
import { SelectComponent } from './components/select/select.component';
import { RadioComponent } from './components/radio/radio.component';
import { BankComponent } from './screens/user/loan-application/bank/bank.component';
import { LoanComponent } from './screens/user/loan-application/loan/loan.component';
import { LoanTableComponent } from './screens/user/summary/loan-table/loan-table.component';
import { LoanCountsComponent } from './screens/user/summary/loan-counts/loan-counts.component';
import { CardsComponent } from './components/cards/cards.component';
import { FilterComponent } from './screens/user/summary/filter/filter.component';
import { SummaryTableComponent } from './screens/user/summary/summary-table/summary-table.component';
import { TableComponent } from './components/table/table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SigninComponent } from './screens/signin/signin.component';
import { AuthInterceptor } from './config/AuthInterceptor';
import { ToasterComponent } from './components/toaster/toaster.component';
import { ToasterService } from './services/toasterService/toaster.service';
import { LoaderComponent } from './components/loader/loader.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoanApplicationComponent,
    ProfileComponent,
    SummaryComponent,
    InputComponent,
    ButtonComponent,
    ModalComponent,
    MobileModalComponent,
    SelectComponent,
    RadioComponent,
    BankComponent,
    LoanComponent,
    LoanTableComponent,
    LoanCountsComponent,
    CardsComponent,
    FilterComponent,
    SummaryTableComponent,
    TableComponent,
    SigninComponent,
    ToasterComponent,
    LoaderComponent,
    PaginationComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
  ],
  providers: [ToasterService , {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
