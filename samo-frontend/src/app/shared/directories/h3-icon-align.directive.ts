import {AfterViewInit, Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appH3IconAlign]'
})
export class H3IconAlignDirective implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    // common h3 styling specification for browsers
    this.el.nativeElement.style.marginTop = '19px';
    this.el.nativeElement.style.marginBottom = '1em';
    this.el.nativeElement.style.left = '10px';
  }

}
