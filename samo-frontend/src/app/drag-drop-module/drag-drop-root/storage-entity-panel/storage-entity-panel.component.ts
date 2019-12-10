import {Component, ElementRef, HostListener, Inject, OnDestroy, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NewEntityAction, NewEntityDialogConfig, NewEntityDialogData} from '../../model/new-entity-dialog-data';
import {EntityType} from '../../model/entity-type.enum';
import {DOCUMENT} from '@angular/common';
import {Observable, Subject} from 'rxjs';
import {delay, takeUntil} from 'rxjs/operators';
import {ConfirmClosePanelComponent} from "../../confirm-close-panel/confirm-close-panel.component";

// TODO: refactor logic around handling uncommitted work, as of now the code is very spaghetti
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

  // the required average ms to do automatic import
  private readonly BARCODE_SPEED  = 9;
  private readonly DESTROYED$     = new Subject<void>();

  private lastImportTargetChange: number;
  private timeBetweenSum: number;
  private scheduleImport$: Subject<void>;

  get hasUncommittedWork(): boolean {
    return this.data.importBarcodes.length !== 0 || this.importTargetBarcode.length !== 0;
  }

  constructor(public dialogRef: MatDialogRef<StorageEntityPanelComponent>,
              @Inject(DOCUMENT) public document,
              @Inject(MAT_DIALOG_DATA) public config: NewEntityDialogConfig,
              public addEntityDialog: MatDialog) {

    this.importTargetBarcode    = '';
    this.data.alias             = config.alias;
    this.scheduleImport$        = new Subject<void>();

    this.scheduleImport$
      .pipe(
        delay(300),
        takeUntil(this.DESTROYED$),
      ).subscribe(() => this.registerImport());

    this.dialogRef.backdropClick()
      .pipe(
        takeUntil(this.DESTROYED$)
      ).subscribe(() => this.attemptAction(this.hasUncommittedWork, this.cancelDialog));
  }

  ngOnDestroy(): void {
    this.DESTROYED$.next();
    this.DESTROYED$.complete();
  }

  onCancelClick(): void {
    this.attemptAction(this.hasUncommittedWork, this.cancelDialog);
  }

  onSubmitClick(): void {
    this.attemptAction(this.importTargetBarcode.length !== 0, this.submitDialog);
  }

  readonly cancelDialog = (): void => {
    this.data.action = NewEntityAction.CANCEL;
    this.dialogRef.close(this.data);
  };

  readonly submitDialog = (): void => {
    this.data.action = NewEntityAction.SUBMIT;
    this.dialogRef.close(this.data);
  };

  attemptAction(predicate: boolean, onConfirmAction: () => void) {
    predicate ? this.confirmDiscard(onConfirmAction) : onConfirmAction();
  }

  private confirmDiscard(onConfirmAction: () => void): void {
    const dialogRef = this.addEntityDialog.open(ConfirmClosePanelComponent);
    dialogRef.afterClosed().subscribe((yesToClose: boolean) => yesToClose ? onConfirmAction() : false);
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

  @HostListener('document:keydown.enter')
  registerImport() {
    this.inputImport?.nativeElement.focus();

    if (this.importTargetBarcode.length <= 0) {
      return;
    }

    this.data.importBarcodes = this.data.importBarcodes.concat(this.importTargetBarcode);

    this.importTargetBarcode = '';
  }
}
