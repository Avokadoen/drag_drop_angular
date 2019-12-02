import {StorageEntity} from "./storage-entity";

export interface EntityWsEvent {
  timestamp:              number;
  movingBarcode:          string;
  previousParentBarcode:  string;
  newParentBarcode:       string;
  currentIndex:           number;
  targetIndex:            number;
}

// export function copyAsTrafficStorageEntity(storageEntity: StorageEntity): StorageEntity {
//   return  {
//     barcode: storageEntity.barcode,
//     children: storageEntity.children.map(c => copyAsTrafficStorageEntity(c)),
//     entityType: storageEntity.entityType,
//   }
// }
