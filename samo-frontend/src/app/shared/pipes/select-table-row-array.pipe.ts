import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectTableRowArray'
})
export class SelectTableRowArrayPipe implements PipeTransform {
  transform(wideArray: string[], narrowArray: string[], currentWidth: number): string[] {
    return (currentWidth <= 600 ? narrowArray : wideArray);
  }
}
