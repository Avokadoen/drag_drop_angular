import {EntityType} from "./entity-type.enum";

export interface StorageEntity {
  barcode: string;
  children: StorageEntity[];
  entityType: EntityType
}
