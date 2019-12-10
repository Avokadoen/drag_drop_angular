import {EntityType} from './entity-type.enum';

export interface NewEntityDialogConfig {
  alias: string;
  entityType: EntityType;
}

export interface NewEntityDialogData {
  action: NewEntityAction;
  alias: string;
  importBarcodes: string[];
}

export enum NewEntityAction {
  CANCEL,
  SUBMIT,
}
