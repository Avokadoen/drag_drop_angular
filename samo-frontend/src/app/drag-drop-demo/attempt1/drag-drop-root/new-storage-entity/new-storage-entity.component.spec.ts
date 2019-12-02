import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStorageEntityDialogComponent } from './new-storage-entity-dialog.component';

describe('NewStorageEntityDialogComponent', () => {
  let component: NewStorageEntityDialogComponent;
  let fixture: ComponentFixture<NewStorageEntityDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewStorageEntityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStorageEntityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
