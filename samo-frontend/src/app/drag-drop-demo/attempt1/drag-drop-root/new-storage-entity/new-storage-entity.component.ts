import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NewEntityAction, NewEntityDialogData} from "../../../model/new-entity-dialog-data";

@Component({
  selector: 'app-new-storage-entity',
  templateUrl: './new-storage-entity.component.html',
  styleUrls: ['./new-storage-entity.component.css']
})
export class NewStorageEntityComponent {

  public data: NewEntityDialogData = {
    entityId: '',
    action: NewEntityAction.CANCEL,
  };

  constructor(public dialogRef: MatDialogRef<NewStorageEntityComponent>,
              @Inject(MAT_DIALOG_DATA) public description: string) { }

  onCancelClick(): void {
    this.data.action = NewEntityAction.CANCEL;
    this.dialogRef.close(this.data);
  }

  onSubmitClick(): void {
    this.data.action = NewEntityAction.SUBMIT;
    this.dialogRef.close(this.data);
  }
}
