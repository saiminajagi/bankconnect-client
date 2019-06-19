import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApilistComponent } from './apilist.component';

describe('ApilistComponent', () => {
  let component: ApilistComponent;
  let fixture: ComponentFixture<ApilistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApilistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApilistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
