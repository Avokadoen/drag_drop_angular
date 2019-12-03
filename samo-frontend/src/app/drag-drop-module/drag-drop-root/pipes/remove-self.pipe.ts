import { Pipe, PipeTransform } from '@angular/core';
import {StorageEntityMeta} from "../../model/storage-entity";

@Pipe({
  name: 'removeSelf'
})
export class RemoveSelfPipe implements PipeTransform {

  transform(self: string, all: StorageEntityMeta[]): string[] {
    return all.map(s => s.barcode).filter(b => b !== self);
  }

}
