import {StorageEntity} from "./storage-entity";

export interface DropBehaviourData {
  predicate: (item: StorageEntity, node: StorageEntity) => boolean;
  illegalDropMessage: string;
}
