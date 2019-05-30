import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatebankaccountComponent } from './createbankaccount.component';

describe('CreatebankaccountComponent', () => {
  let component: CreatebankaccountComponent;
  let fixture: ComponentFixture<CreatebankaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatebankaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatebankaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
