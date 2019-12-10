import {StorageEntity} from './storage-entity';

export interface SamoEntityResponse {
  optidevEntity: StorageEntity | null;
  errorMessage: string;
}
