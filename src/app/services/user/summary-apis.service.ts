import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SummaryApisService {
  constructor(private http: HttpClient) {}

  fetchUserLoansStatusCount(data: {
    userId: number;
    search: string;
    startDate: string;
    endDate: string;
  }) {
    const { userId, search, startDate, endDate } = data;

    const params = new URLSearchParams();
    params.set('search', search);
    params.set('startDate', !startDate ? '1000-01-01' : startDate);
    params.set('endDate', !endDate ? '1000-01-01' : endDate);
    return this.http.get(`/user/loan/${userId}/statuses?${params.toString()}`);
  }

  fetchUserLoans = (data: {
    userId: number;
    search: string;
    startDate: string;
    endDate: string;
    page: number;
    size: number;
  }) => {
    const { userId, search, startDate, endDate, page, size } = data;
    let newPage = 0;
    if (page > 0) {
      newPage = page - 1;
    }
    const params = new URLSearchParams();
    params.set('search', search);
    params.set('startDate', !startDate ? '1000-01-01' : startDate);
    params.set('endDate', !endDate ? '1000-01-01' : endDate);
    params.set('page', newPage.toString());
    params.set('size', size.toString());

    return this.http.get(`/user/loans/${userId}?${params.toString()}`);
  };
}
