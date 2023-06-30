import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoanApplicationApisService {
  constructor(private http: HttpClient) {}

  searchDetailsByMobile(mobile: number) {
    return this.http.get(`/user/searchProfile/${mobile}`);
  }

  fetchConfiguration(partnerId: number) {
    return this.http.get(
      `/user/partnerConfig/${partnerId}`
    );
  }

  postProfileDetails(partnerId: number, userId: number, data: any) {
    return this.http.post(
      `/user/save-profile/${partnerId}/${userId}`,
      data
    );
  }

  fetchByLoanId(loanId: string) {
    return this.http.get(`/user/loan/${loanId}`);
  }

  fetchBankDetails(ifsc: string) {
    return this.http.get(`https://ifsc.razorpay.com/${ifsc}`);
  }

  postBankDetails = (
    partnerId: number,
    userId: number,
    profileId: number,
    updatedData: any
  ) => {
    return this.http.post(
      `/user/loan/${partnerId}/${userId}/create-bank/${profileId}`,
      updatedData
    );
  };

  postLoanDetails = (
    partnerId: number,
    userId: number,
    profileId: number,
    updatedData: any
  ) => {
    return this.http.post(
      `/user/loan/${partnerId}/${userId}/create-loan/${profileId}`,
      updatedData
    );
  };
}
