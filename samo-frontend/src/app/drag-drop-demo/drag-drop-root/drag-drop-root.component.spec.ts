import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropRootComponent } from './drag-drop-root.component';

describe('DragDropRootComponent', () => {
  let component: DragDropRootComponent;
  let fixture: ComponentFixture<DragDropRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragDropRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragDropRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
