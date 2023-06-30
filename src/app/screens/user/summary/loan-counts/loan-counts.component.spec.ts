import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanCountsComponent } from './loan-counts.component';

describe('LoanCountsComponent', () => {
  let component: LoanCountsComponent;
  let fixture: ComponentFixture<LoanCountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanCountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
