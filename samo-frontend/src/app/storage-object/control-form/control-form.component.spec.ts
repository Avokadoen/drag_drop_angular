import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlFormComponent } from './control-form.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('ControlFormComponent', () => {
  let component: ControlFormComponent;
  let fixture: ComponentFixture<ControlFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlFormComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
