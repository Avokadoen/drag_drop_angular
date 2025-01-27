import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryListComponent } from './delivery-list.component';
import { isEqual } from '../../shared/functions/equality';
import {AppModule} from '../../app.module';

describe('Component: DeliveryListComponent', () => {
  let component: DeliveryListComponent;
  let fixture: ComponentFixture<DeliveryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryListComponent, AppModule, isEqual],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
