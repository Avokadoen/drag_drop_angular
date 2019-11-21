import { LoadingIndicatorDirective } from './loading-indicator.directive';
import {async, TestBed} from "@angular/core/testing";
import {ElementRef} from "@angular/core";

beforeEach(async(() => {
  TestBed.configureTestingModule({
    providers: [
      //more providers
      { provide: ElementRef, useClass: MockElementRef }
    ]
  }).compileComponents();
}));

describe('LoadingIndicatorDirective', () => {
  it('should create an instance', () => {
    const directive = new LoadingIndicatorDirective();
    expect(directive).toBeTruthy();
  });
});
