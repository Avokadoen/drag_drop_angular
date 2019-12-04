import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NewEntityAction, NewEntityDialogConfig, NewEntityDialogData} from "../../model/new-entity-dialog-data";
import {StorageEntity} from "../../model/storage-entity";
import {EntityType} from "../../model/entity-type.enum";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-new-storage-entity',
  templateUrl: './new-storage-entity.component.html',
  styleUrls: ['./new-storage-entity.component.css']
})
export class NewStorageEntityComponent {

  public data: NewEntityDialogData = {
    alias: '',
    newChildren: [],
    action: NewEntityAction.CANCEL,
  };

  public importTargetBarcode: string;

  get canHaveChildren(): boolean {
    return this.config.entityType !== EntityType.OBJECT;
  }

  @ViewChild('inputImport', {static: false}) inputImport: ElementRef;

  constructor(public dialogRef: MatDialogRef<NewStorageEntityComponent>,
              @Inject(DOCUMENT) public document,
              @Inject(MAT_DIALOG_DATA) public config: NewEntityDialogConfig) {
    this.importTargetBarcode = '';
    this.data.alias = config.alias;
  }

  onCancelClick(): void {
    this.data.action = NewEntityAction.CANCEL;
    this.dialogRef.close(this.data);
  }

  onSubmitClick(): void {
    this.data.action = NewEntityAction.SUBMIT;
    this.dialogRef.close(this.data);
  }

  // TODO: service with backend
  mockImport() {
    this.inputImport.nativeElement?.focus();

    if (this.importTargetBarcode.length <= 0) {
      return;
    }

    const newEntity: StorageEntity = {
      barcode: this.importTargetBarcode,
      entityType: Math.trunc(Math.random() * this.config.entityType.valueOf()) as EntityType,
      children: [],
    };

    this.data.newChildren = this.data.newChildren.concat(newEntity);

    this.importTargetBarcode = '';
  }
}
