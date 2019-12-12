import {StorageEntityMeta} from './storage-entity';
import {NodeChange} from "./node-change-event";

// TODO: SHOULD HAVE A TYPE: IMPORT, MOVE, DELETE to simplify undo
export interface EntityWsEvent {
  timestamp: number;
  source: StorageEntityMeta;
  currentParentBarcode: string;
  newParentBarcode: string;
  wasUndoEvent: boolean;
}

export function isEntityWsEvent(event: EntityWsEvent | NodeChange): event is EntityWsEvent {
  return (event as EntityWsEvent).timestamp !== undefined;
}
