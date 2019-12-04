import {StorageEntity} from "./storage-entity";
import {EntityType} from "./entity-type.enum";

export interface NewEntityDialogConfig {
  alias: string;
  entityType: EntityType;
}

export interface NewEntityDialogData {
  action: NewEntityAction;
  alias: string;
  newChildren: StorageEntity[];
}

export enum NewEntityAction {
  CANCEL,
  SUBMIT,
}
