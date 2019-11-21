import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appLoadingIndicator]'
})
export class LoadingIndicatorDirective {

  /**
  * used to indicate loading, this is a binding, so it will be synced between parent and directive
  * */
  @Input('appLoadingIndicator')
  set isLoading(isLoading: boolean) {
    this.el.nativeElement.style.background = (isLoading ? '#d3d3d3' : 'inherit');
  }

  constructor(private el: ElementRef) {
  }
}
