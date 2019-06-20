import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinprofileComponent } from './finprofile.component';

describe('FinprofileComponent', () => {
  let component: FinprofileComponent;
  let fixture: ComponentFixture<FinprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
