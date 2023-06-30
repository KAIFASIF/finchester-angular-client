import { TestBed } from '@angular/core/testing';

import { SigninApiService } from './signin-api.service';

describe('SigninApiService', () => {
  let service: SigninApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SigninApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
