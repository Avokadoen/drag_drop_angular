import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageEntityDraggableComponent } from './storage-entity-draggable .component';

describe('StorageEntityN1DisplayComponent', () => {
  let component: StorageEntityDraggableComponent;
  let fixture: ComponentFixture<StorageEntityDraggableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageEntityDraggableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageEntityDraggableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
