import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appHoverFocus]'
})
export class HoverFocusDirective {

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.filter = 'drop-shadow(0px 0px 12px rgb(50%, 50%, 50%))';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.filter = '';
  }
}
