import {StorageEntity} from './storage-entity';
import {EntityType} from "./entity-type.enum";

// TODO: rename item to movingNode, and node to targetNode
export interface DropBehaviourData {
  predicate: (item: StorageEntity, node: StorageEntity) => boolean;
  illegalDropMessage: string;
}

export function formatIllegalDropMessage(dropBehaviourData: DropBehaviourData, movedType: EntityType, targetType: EntityType): string {
  return dropBehaviourData.illegalDropMessage
    .replace('{0}', EntityType[movedType].toLocaleLowerCase())
    .replace('{1}', EntityType[targetType].toLocaleLowerCase());
}
