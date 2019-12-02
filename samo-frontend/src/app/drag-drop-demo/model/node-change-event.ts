import {StorageEntity} from "./storage-entity";
import {CdkDragDrop} from "@angular/cdk/drag-drop";

export interface NodeChange {
  movingEntity:   StorageEntity;
  currentParent:  StorageEntity;
  newParent:      StorageEntity;
  currentIndex:   number;
  targetIndex:    number;
}

// TODO: rename if no other types are included
export function cdkEventIntoNodeChangeEvent(event: CdkDragDrop<StorageEntity>, currentIndex: number, targetIndex: number): NodeChange {
  return <NodeChange> {
    movingEntity:   event.item.data,
    currentParent:  event.previousContainer.data,
    newParent:      event.container.data,
    currentIndex:   currentIndex,
    targetIndex:    targetIndex,
  }
}
