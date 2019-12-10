import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

/**
 * Used to align icons next to text, **follows firefox specification** so it might be faulty with other browsers
 */
@Directive({
  selector: '[appTextIconAlign]'
})
export class TextIconAlignDirective implements AfterViewInit {

   @Input() appTextIconAlign: 'p' | 'h3'; // TODO: more text types

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    switch (this.appTextIconAlign) {
      case "p":
        this.el.nativeElement.style.margin = '16px 0 16px 0';
        break;
      case "h3":
        this.el.nativeElement.style.marginTop = '19px';
        this.el.nativeElement.style.marginBottom = '1em';
        this.el.nativeElement.style.left = '10px';
        break;
      default:
        console.error('text icon align supplied with incompatible compliment type');
        break;
    }
  }

}
