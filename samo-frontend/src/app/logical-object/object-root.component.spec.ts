import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectRootComponent } from './object-root.component';

describe('ObjectRootComponent', () => {
  let component: ObjectRootComponent;
  let fixture: ComponentFixture<ObjectRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
