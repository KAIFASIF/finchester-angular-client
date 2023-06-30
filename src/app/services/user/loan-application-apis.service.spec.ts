import { TestBed } from '@angular/core/testing';

import { LoanApplicationApisService } from './loan-application-apis.service';

describe('LoanApplicationApisService', () => {
  let service: LoanApplicationApisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanApplicationApisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
