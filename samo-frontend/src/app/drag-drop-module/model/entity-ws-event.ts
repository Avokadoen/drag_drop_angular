import {StorageEntityMeta} from './storage-entity';

export interface EntityWsEvent {
  timestamp: number;
  source: StorageEntityMeta;
  currentParentBarcode: string;
  newParentBarcode: string;
}

