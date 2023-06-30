import { TestBed } from '@angular/core/testing';

import { SummaryApisService } from './summary-apis.service';

describe('SummaryApisService', () => {
  let service: SummaryApisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummaryApisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
