import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appFillHeight]'
})
export class FillHeightDirective {

  /**
  * used to retract from given total height
  * */
  @Input('appFillHeight')
  set takeHeight(takeHeight: string) {
    this.el.nativeElement.style.height = `calc(100vh - ${takeHeight})`;
  }

  constructor(private el: ElementRef) {
  }

}
