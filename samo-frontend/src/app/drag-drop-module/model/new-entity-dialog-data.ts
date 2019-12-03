export interface NewEntityDialogData {
  entityId: string;
  action: NewEntityAction;
}

export enum NewEntityAction {
  CANCEL,
  SUBMIT,
}
