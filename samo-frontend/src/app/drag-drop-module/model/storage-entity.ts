import {EntityType} from './entity-type.enum';
import {ElementRef} from '@angular/core';

export interface DisplayStorageEntity {
  barcode: string;
  entityType: EntityType;
  children: StorageEntity[] | DisplayStorageEntity[];
  containerElementRefCache?: ElementRef<Element>;
  hideChildren?: boolean;
  alias?: string;
}

/**
 * can be used for ui elements that has some custom behaviour. i.e delete list
 */
export interface UtilityStorageEntity {
  barcode: string;
  entityType: EntityType.LOCATION;
  children: [];
  containerElementRefCache?: ElementRef<Element>;
  hideChildren: boolean;
  alias: string;
}

export interface StorageEntity {
  barcode: string;
  entityType: EntityType;
  children: StorageEntity[] | DisplayStorageEntity[];
}

export interface StorageEntityMeta {
  barcode: string;
  entityType: EntityType;
}

