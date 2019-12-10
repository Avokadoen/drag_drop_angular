import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateRegisterDeliveryComponent } from './generate-register-delivery.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('GenerateRegisterDeliveryComponent', () => {
  let component: GenerateRegisterDeliveryComponent;
  let fixture: ComponentFixture<GenerateRegisterDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateRegisterDeliveryComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
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
