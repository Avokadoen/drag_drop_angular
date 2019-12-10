import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmClosePanelComponent } from './confirm-close-panel.component';

describe('ConfirmClosePanelComponent', () => {
  let component: ConfirmClosePanelComponent;
  let fixture: ComponentFixture<ConfirmClosePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmClosePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmClosePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
