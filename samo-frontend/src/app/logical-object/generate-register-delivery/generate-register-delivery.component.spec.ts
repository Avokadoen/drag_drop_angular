import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateRegisterDeliveryComponent } from './generate-register-delivery.component';

describe('GenerateRegisterDeliveryComponent', () => {
  let component: GenerateRegisterDeliveryComponent;
  let fixture: ComponentFixture<GenerateRegisterDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateRegisterDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateRegisterDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
