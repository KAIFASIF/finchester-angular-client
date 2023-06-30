import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if it is a sign-in request
    if (request.url.includes('/signin')) {
      return next.handle(request); // Skip appending token for sign-in request
    }
    if (request.url.includes('https://ifsc.razorpay.com')) {
      return next.handle(request); // Skip appending token for sign-in request
    }

    // Retrieve token from local storage
    const token: string | null = localStorage.getItem('token');
    if(token){

    }

    // Add token and base URL to the request
    const modifiedRequest = request.clone({
      // setHeaders: {
      //   Authorization: `Bearer ${token}`,
      // },
      url: 'http://localhost:9090' + request.url,
    });

    return next.handle(modifiedRequest);
  }
}
