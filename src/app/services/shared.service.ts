import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  closeMobileModal: boolean = true;

  partnerId: number | null = null;
  role: string | null = null;
  user: any = null;
  profileId: any;
  partnerName: string  =''

  // private partnerIdSubject = new BehaviorSubject<number | null>(null);
  // public partnerId$ = this.partnerIdSubject.asObservable();

  // private userSubject = new BehaviorSubject<any>(null);
  // public user$ = this.userSubject.asObservable();

  // private roleSubject = new BehaviorSubject<String | null>(null);
  // public role$ = this.roleSubject.asObservable();

  // private profileDetailsSubject = new BehaviorSubject<any>(null);
  // public profileDetails$ = this.profileDetailsSubject.asObservable();

  // private bankDetailSubject = new BehaviorSubject<any>(null);
  // public bankDetails$ = this.bankDetailSubject.asObservable();

  // private loanDetailSubject = new BehaviorSubject<any>(null);
  // public loanDetails$ = this.loanDetailSubject.asObservable();

  // private mobileNoSubject = new BehaviorSubject<any>(null);
  // public mobileNo$ = this.mobileNoSubject.asObservable();

  // set profileDetails(data: any) {
  //   this.profileDetailsSubject.next(data);
  // }

  // set bankDetails(data: any) {
  //   this.bankDetailSubject.next(data);
  // }

  // set loanDetails(data: any) {
  //   this.loanDetailSubject.next(data);
  // }

  // set mobileNo(data: any) {
  //   this.mobileNoSubject.next(data);
  // }
}
