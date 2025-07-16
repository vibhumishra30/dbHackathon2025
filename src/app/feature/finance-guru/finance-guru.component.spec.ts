import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceGuruComponent } from './finance-guru.component';

describe('FinanceGuruComponent', () => {
  let component: FinanceGuruComponent;
  let fixture: ComponentFixture<FinanceGuruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceGuruComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceGuruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
