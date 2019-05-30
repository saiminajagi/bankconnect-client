import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminaccountsetupComponent } from './adminaccountsetup.component';

describe('AdminaccountsetupComponent', () => {
  let component: AdminaccountsetupComponent;
  let fixture: ComponentFixture<AdminaccountsetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminaccountsetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminaccountsetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
