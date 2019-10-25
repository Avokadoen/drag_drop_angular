import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalDashboardComponent } from './organisation-dashboard.component';

describe('OrganisationDashboardComponent', () => {
  let component: InternalDashboardComponent;
  let fixture: ComponentFixture<InternalDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
