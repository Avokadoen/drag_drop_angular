import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'stringFilter'})
export class StringFilterPipe implements PipeTransform {
  transform(master: string[], query: string): string[] {
    return master.filter(s => s.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
  }
}
