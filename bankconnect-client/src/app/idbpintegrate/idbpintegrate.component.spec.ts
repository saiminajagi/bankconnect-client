import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdbpintegrateComponent } from './idbpintegrate.component';

describe('IdbpintegrateComponent', () => {
  let component: IdbpintegrateComponent;
  let fixture: ComponentFixture<IdbpintegrateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdbpintegrateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdbpintegrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
