import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSelf'
})
export class RemoveSelfPipe implements PipeTransform {

  transform(self: string, all: string[]): string[] {
    return all.filter(s => s != self);
  }

}
