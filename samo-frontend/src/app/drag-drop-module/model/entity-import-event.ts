import {StorageEntity} from './storage-entity';

export interface EntityImportEvent {
  source: StorageEntity;
  importBarcodes: string[];
}
