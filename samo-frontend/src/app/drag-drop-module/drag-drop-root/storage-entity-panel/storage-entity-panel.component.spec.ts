import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {StorageEntityPanelComponent} from "./storage-entity-panel.component";


describe('NewStorageEntityDialogComponent', () => {
  let component: StorageEntityPanelComponent;
  let fixture: ComponentFixture<StorageEntityPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageEntityPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageEntityPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
