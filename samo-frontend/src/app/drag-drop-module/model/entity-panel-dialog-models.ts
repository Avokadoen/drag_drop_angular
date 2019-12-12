import {EntityType} from './entity-type.enum';

export interface EntityPanelDialogConfig {
  barcode: string;
  alias: string;
  entityType: EntityType;
}

export interface EntityPanelDialogData {
  action: EntityPanelAction;
  alias: string;
  importBarcodes: string[];
}

export interface ConfirmClosePanelConfig {
  description: string;
  conciseDescription: string;
}

export enum EntityPanelAction {
  CANCEL,
  SUBMIT,
  DELETE,
}
