import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, } from '@angular/core';
import {CdkDragDrop, CdkDragEnter, CdkDragMove} from '@angular/cdk/drag-drop';
import {DisplayStorageEntity, StorageEntityMeta} from '../../model/storage-entity';
import {interval} from 'rxjs';
import {endWith, map, startWith, take} from 'rxjs/operators';
import {DropBehaviourData, formatIllegalDropMessage} from '../../model/drop-behaviour-data';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {EntityType} from '../../model/entity-type.enum';
import {StorageEntityPanelComponent} from '../storage-entity-panel/storage-entity-panel.component';
import {EntityImportEvent} from '../../model/entity-import-event';
import {EntityPanelAction, EntityPanelDialogConfig, EntityPanelDialogData} from "../../model/entity-panel-dialog-models"
import {ProgmatDelete} from "../../model/progmat-delete";

// Sources: code is heavily inspired on Ilya Pakhomov's code that can be found here:
// https://stackblitz.com/edit/angular-cdk-nested-drag-drop-demo
@Component({
  selector: 'app-storage-entity-draggable',
  templateUrl: './storage-entity-draggable.component.html',
  styleUrls: ['./storage-entity-draggable.component.scss', '../drag-drop-root.component.scss']
})
export class StorageEntityDraggableComponent implements OnChanges, OnInit, AfterViewInit {

  public get dragDisabled(): boolean {
    return !this.parentEntity;
  }

  public get parentEntityId(): string {
    return this.parentEntity?.barcode + this.storageNode.barcode ?? this.ROOT_NODE;
  }

  public get getChildCount(): number {
      return this.countChildren(this.storageNode);
  }

  public get isObjectType(): boolean {
    return this.storageNode.entityType === EntityType.OBJECT;
  }

  public get isLocation(): boolean {
    return this.storageNode.entityType === EntityType.LOCATION;
  }

  public get hideChildren(): boolean {
    return this.storageNode?.hideChildren;
  }

  public get getEntityTypeString(): string {
    return !this.isLocation ? `- ${EntityType[this.storageNode.entityType].toLocaleLowerCase()}` : '';
  }

  public get getDisplayString() {
    return this.storageNode.alias ?? this.storageNode.barcode;
  }

  public get getNodeDescriptor(): string {
    return `${this.getDisplayString} ${this.getEntityTypeString}`;
  }

  readonly ILLEGAL_MOVE_COLOR = 'rgb(230, 20, 20, 0.6)';
  private readonly ROOT_NODE = 'rootNode';

  @Input() parentEntity?: DisplayStorageEntity;
  @Input() storageNode: DisplayStorageEntity;
  @Input() allPossibleEntityRelations: StorageEntityMeta[];
  @Input() dropBehaviourData: DropBehaviourData;
  @Input() depth: number;
  @Input() overwriteNodeColor?: string;

  @Output() entityMove:           EventEmitter<CdkDragMove<DisplayStorageEntity>>;
  @Output() entityDrop:           EventEmitter<CdkDragDrop<DisplayStorageEntity>>;
  @Output() entityProgmatDelete:  EventEmitter<ProgmatDelete>;
  @Output() entityImport:         EventEmitter<EntityImportEvent>;

  private nodeBackgroundColor: string;
  private dropListBackgroundColor: string;
  private formattedDescription: string;
  private listMargin: string;
  private prevParentId: string;

  constructor(private snackBar: MatSnackBar,
              public addEntityDialog: MatDialog) {
    this.entityDrop           = new EventEmitter<CdkDragDrop<DisplayStorageEntity>>();
    this.entityMove           = new EventEmitter<CdkDragMove<DisplayStorageEntity>>();
    this.entityProgmatDelete  = new EventEmitter<ProgmatDelete>();
    this.entityImport         = new EventEmitter<EntityImportEvent>();

    this.prevParentId = '';
  }

  // TODO: do we want shallow child count?
  public countChildren(storageNode: DisplayStorageEntity): number {
    let count = storageNode.children.length;
    for (const child of storageNode.children) {
      if (child.children.length > 0) {
        count += this.countChildren(child);
      }
    }
    return count;
  }

  ngOnInit(): void {
    if (this.overwriteNodeColor) {
      this.nodeBackgroundColor = this.overwriteNodeColor;
    } else {
      switch (this.storageNode.entityType) {
        case EntityType.OBJECT:
          this.nodeBackgroundColor = 'rgb(155, 209, 232, opacity)';
          break;
        case EntityType.BOX:
          this.nodeBackgroundColor = 'rgb(175, 155, 232, opacity)';
          break;
        case EntityType.CRATE:
          this.nodeBackgroundColor = 'rgb(230, 173, 232, opacity)';
          break;
        case EntityType.PALLET:
          this.nodeBackgroundColor = 'rgb(232, 173, 173, opacity)';
          break;
        case EntityType.LOCATION:
          this.nodeBackgroundColor = 'rgb(232, 208, 173, opacity)';
          break;
        default:
          console.error(`illegal entity type on node ${this.storageNode.barcode}, state: ${this.storageNode.entityType}`);
          break;
    }
  }
}

  ngOnChanges() {
    const childCount = this.getChildCount;
    this.formattedDescription = (childCount > 0 ? `${childCount} child entities` : 'no children');

    if (this.prevParentId !== this.parentEntityId) {
      const marginlr  = Math.max(30 - this.depth * 2, 0);
      this.listMargin = `0 ${marginlr}px 0 ${marginlr}px`;

      this.prevParentId = this.parentEntityId;
    }

    // TODO: this should be retrieved on drop, and maybe drag
    this.storageNode.containerElementRefCache = new ElementRef(document.getElementById(this.parentEntityId));
  }

  ngAfterViewInit(): void {
    // we set all children  because of bindings between components
    this.storageNode.containerElementRefCache
      = this.storageNode.containerElementRefCache ?? new ElementRef(document.getElementById(this.parentEntityId));
  }

  public onDragDrop(event: CdkDragDrop<DisplayStorageEntity>): void {
    if (this.dropBehaviourData.predicate(event.item.data, this.storageNode)) {
      this.entityDrop.emit(event);
      this.dropListBackgroundColor = '';
    } else {
      this.toastIllegalDropMessage(event.item.data.entityType, event.container.data.entityType);
      this.entityMove.emit(null);
      interval(140).pipe(
        take(3),
        map(n => (n % 2 === 0) ? this.ILLEGAL_MOVE_COLOR : ''),
        startWith(''),
        endWith(''),
      ).subscribe( c => {
        this.dropListBackgroundColor = c;
      });
    }
  }

  public onDragMove(event: CdkDragMove<DisplayStorageEntity>): void {
    this.entityMove.emit(event);

    if (!event || event.source.data !== this.storageNode) {
      return;
    }

    const nodeMovePreview = new ElementRef<HTMLElement>(document.getElementById(this.storageNode.barcode + 'preview'));
    if (!nodeMovePreview.nativeElement) {
      return;
    }
  }

  public opacityAsCSSStr(opacity: number): string {
    return this.nodeBackgroundColor?.replace('opacity', opacity.toString());
  }

  public onEntityEnterList(event: CdkDragEnter<DisplayStorageEntity>): void {
    if (this.dropBehaviourData.predicate(event.item.data, this.storageNode)) {
      this.dropListBackgroundColor = 'lightgreen';
    } else {
      this.dropListBackgroundColor = this.ILLEGAL_MOVE_COLOR;
    }
  }

  public onEntityExitList(): void {
    this.dropListBackgroundColor = '';
  }

  public toastIllegalDropMessage(movedType: EntityType, targetType: EntityType) {
    this.snackBar.open(formatIllegalDropMessage(this.dropBehaviourData, movedType, targetType), 'ok', {
      duration: 5500,
      verticalPosition: 'top',
    });
  }

  // TODO: move this as a static of the dialog component
  onNodePanelClicked() {
    const dialogConfig: EntityPanelDialogConfig = this.storageNode as EntityPanelDialogConfig;

    const dialogRef = this.addEntityDialog.open(StorageEntityPanelComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '25vh',
      data: dialogConfig,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: EntityPanelDialogData) => {
      switch (result.action) {
        case EntityPanelAction.SUBMIT:
          if (result.alias) {
            this.storageNode.alias = result.alias;
          }

          if (result.importBarcodes) {
            const importEvent: EntityImportEvent = {
              source: this.storageNode,
              importBarcodes: result.importBarcodes,
            };

            this.entityImport.emit(importEvent);
          }
          break;
        case EntityPanelAction.DELETE:
          const progmatDelete: ProgmatDelete = {
            source: this.storageNode
          };

          this.entityProgmatDelete.emit(progmatDelete);
          break;
      }
    });
  }

  onToggleHiddenClicked() {
    this.storageNode.hideChildren = !this.storageNode.hideChildren;
  }

  childTrackByFn(index: number, child: DisplayStorageEntity): string {
    return child.barcode + index;
  }
}
