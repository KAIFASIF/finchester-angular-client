import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SigninApiService {
  constructor(private http: HttpClient) {}

  postsigninDetails(data: any) {
    return this.http.post(`http://localhost:9090/signin`, data);
  }
}
