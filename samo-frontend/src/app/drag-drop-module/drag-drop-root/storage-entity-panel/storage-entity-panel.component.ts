import {Component, ElementRef, Inject, OnDestroy, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NewEntityAction, NewEntityDialogConfig, NewEntityDialogData} from '../../model/new-entity-dialog-data';
import {EntityType} from '../../model/entity-type.enum';
import {DOCUMENT} from '@angular/common';
import {Subject} from 'rxjs';
import {delay, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-storage-entity-panel',
  templateUrl: './storage-entity-panel.component.html',
  styleUrls: ['./storage-entity-panel.component.css']
})
export class StorageEntityPanelComponent implements OnDestroy {

  public data: NewEntityDialogData = {
    alias: '',
    importBarcodes: [],
    action: NewEntityAction.CANCEL,
  };

  public importTargetBarcode: string;

  get canHaveChildren(): boolean {
    return this.config.entityType !== EntityType.OBJECT;
  }

  @ViewChild('inputImport', {static: false}) inputImport: ElementRef;

  private readonly BARCODE_SPEED = 15;
  private readonly DESTROYED$ = new Subject<void>();

  private lastImportTargetChange: number;
  private timeBetweenSum: number;
  private scheduleImport$: Subject<void>;

  constructor(public dialogRef: MatDialogRef<StorageEntityPanelComponent>,
              @Inject(DOCUMENT) public document,
              @Inject(MAT_DIALOG_DATA) public config: NewEntityDialogConfig) {

    this.importTargetBarcode    = '';
    this.data.alias             = config.alias;
    this.scheduleImport$        = new Subject<void>();

    this.scheduleImport$
      .pipe(
        delay(300),
        takeUntil(this.DESTROYED$),
      ).subscribe(() => this.mockImport());
  }

  ngOnDestroy(): void {
    this.DESTROYED$.next();
    this.DESTROYED$.complete();
  }

  onCancelClick(): void {
    this.data.action = NewEntityAction.CANCEL;
    this.dialogRef.close(this.data);
  }

  onSubmitClick(): void {
    this.data.action = NewEntityAction.SUBMIT;
    this.dialogRef.close(this.data);
  }

  onImportTargetChange() {
    if (!this.lastImportTargetChange || this.importTargetBarcode.length < 1) {
      this.lastImportTargetChange = Date.now();
      this.timeBetweenSum         = 0;
    }

    const now = Date.now();
    const timeBetween = Math.min(now - this.lastImportTargetChange, 10000);
    this.lastImportTargetChange = now;

    this.timeBetweenSum += timeBetween;
    const averageTimeBetween = this.timeBetweenSum / this.importTargetBarcode.length;

    if (averageTimeBetween < this.BARCODE_SPEED) {
      this.scheduleImport$.next();
    }
  }

  mockImport() {
    this.inputImport?.nativeElement.focus();

    if (this.importTargetBarcode.length <= 0) {
      return;
    }

    this.data.importBarcodes = this.data.importBarcodes.concat(this.importTargetBarcode);

    this.importTargetBarcode = '';
  }
}
