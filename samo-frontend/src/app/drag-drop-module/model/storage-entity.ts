import {EntityType} from "./entity-type.enum";
import {ElementRef} from "@angular/core";

export interface DisplayStorageEntity {
  barcode: string;
  entityType: EntityType;
  children: StorageEntity[] | DisplayStorageEntity[];
  containerElementRefCache?: ElementRef<Element>;
  alias?: string;
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

