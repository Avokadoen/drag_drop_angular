import {Component, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DisplayStorageEntity, StorageEntity, StorageEntityMeta, UtilityStorageEntity} from "../model/storage-entity";
import {EntityType} from "../model/entity-type.enum";
import {CdkDragDrop, CdkDragMove, moveItemInArray, transferArrayItem,} from "@angular/cdk/drag-drop";
import {ScreenPosition} from "../model/screen-position";
import {DropBehaviourData} from "../model/drop-behaviour-data";
import {MatSidenav} from "@angular/material/sidenav";
import {NewStorageEntityComponent} from "./new-storage-entity/new-storage-entity.component";
import {MatDialog} from "@angular/material/dialog";
import {WebSocketService} from "../web-socket/web-socket.service";
import {EntityWsEvent} from "../model/entity-ws-event";
import {takeUntil} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subject} from "rxjs";
import {cdkEventIntoNodeChangeEvent, NodeChange} from "../model/node-change-event";

// TODO: rewrite web socket sync logic to ignore sort only events
@Component({
  selector: 'app-drag-drop-root',
  templateUrl: './drag-drop-root.component.html',
  styleUrls: ['./drag-drop-root.component.scss']
})
export class DragDropRootComponent implements OnChanges, OnInit, OnDestroy {

  readonly DELETE_NODE: UtilityStorageEntity = {
    barcode: 'deleteList',
    alias: 'delete list',
    entityType: EntityType.LOCATION,
    children: [],
  };

  readonly DROP_DELETE_DATA: DropBehaviourData = {
    predicate: function (item: StorageEntity, _: StorageEntity): boolean {
      return item.children.length <= 0;
    },
    illegalDropMessage: 'Cannot delete an entity with children',
  };

  readonly DROP_MOVE_DATA: DropBehaviourData = {
    predicate: function (item: StorageEntity, node: StorageEntity): boolean {
      return item.entityType.valueOf() < node.entityType.valueOf() && item.barcode !== node.barcode;
    },
    illegalDropMessage: 'Cannot move an entity of type {0} into an entity of type {1}',
  };

  private readonly DESTROYED$ = new Subject();

  @ViewChild('drawer', {static: true}) drawer: MatSidenav;

  storageRoot: DisplayStorageEntity =
    {
      barcode: 'Ranamottaj',
      entityType: EntityType.LOCATION,
      alias: 'Rana mottak',
      children: [
        {
          barcode: 'pallet1',
          entityType: EntityType.PALLET,
          children: [
            {
              barcode: 'object1',
              entityType: EntityType.OBJECT,
              children: [],
            },
            {
              barcode: 'object2',
              entityType: EntityType.OBJECT,
              children: [],
            }
          ],
        },
        {
          barcode: 'pallet2',
          entityType: EntityType.PALLET,
          children: [
            {
              barcode: 'crate1',
              entityType: EntityType.CRATE,
              children: [
                {
                  barcode: 'object3',
                  entityType: EntityType.OBJECT,
                  children: [],
                },
                {
                  barcode: 'box1',
                  entityType: EntityType.BOX,
                  children: [
                    {
                      barcode: 'object6',
                      entityType: EntityType.OBJECT,
                      children: [],
                    }],
                }],
            }],
        },
        {
          barcode: 'object5',
          entityType: EntityType.OBJECT,
          children: [],
        },
        {
          barcode: 'object4',
          entityType: EntityType.OBJECT,
          children: [],
        },
      ],
    };

  currentEntityEvent: CdkDragMove<DisplayStorageEntity> | null;

  public get getSimplifiedTree(): StorageEntityMeta[] {
    // We reverse ids here to respect items nesting hierarchy
    return this.simplifyStorageNodes(this.storageRoot)
      .concat(this.DELETE_NODE)
      .reverse();
  }

  constructor(private webSocketService: WebSocketService,
              public addEntityDialog: MatDialog,
              private snackBar: MatSnackBar,) {
  }

  ngOnInit() {
    this.webSocketService.CHANGE$
      .asObservable()
      .pipe(
        takeUntil(this.DESTROYED$)
      ).subscribe((wsEvent: EntityWsEvent) => this.handleWsEvent(wsEvent));
  }

  ngOnChanges() {
    // TODO: generate allObjectBarcodes
    // TODO: update accept new objects from service
  }

  public ngOnDestroy (): void {
    this.DESTROYED$.next();
    this.DESTROYED$.complete();
  }

  public onDragMove(event: CdkDragMove<StorageEntity>) {
    this.currentEntityEvent = event;
  }

  public onDragDrop(event: CdkDragDrop<StorageEntity>) {
    const movingEntity: DisplayStorageEntity  = event.item.data;
    const currentParent                       = event.previousContainer.data;
    const newParent                           = event.container.data;

    const currentIndex = currentParent.children.indexOf(event.item.data);
    const targetIndex
      = (newParent.barcode !== this.DELETE_NODE.barcode)
      ? DragDropRootComponent.calculateNewIndex(this.currentEntityEvent.pointerPosition, movingEntity.barcode, newParent.children as DisplayStorageEntity[])
      : 0;

    const change = cdkEventIntoNodeChangeEvent(event, currentIndex, targetIndex);
    this.webSocketService.sendChange(change);
    this.handleNodeChange(change);
  }

  public handleNodeChange(change: NodeChange) {
    if (!change.movingEntity || !change.currentParent || !change.newParent) {
      this.snackBar.open('Entity tree is out of sync, please refresh page!','ok', {
        duration: 20000,
        verticalPosition: 'top',
      });

      this.currentEntityEvent = null;
      return;
    }

    switch (change.newParent.barcode) {
      case this.DELETE_NODE.barcode:
        change.currentParent.children.splice(change.currentIndex, 1);
        break;
      case change.currentParent.barcode:
        moveItemInArray(change.currentParent.children, change.currentIndex, change.targetIndex);
        break;
      default:
        transferArrayItem(change.currentParent.children, change.newParent.children, change.currentIndex, change.targetIndex);
        break;
    }

    this.currentEntityEvent = null;
  }

  // TODO: bug you cant just place object in delete area as element is kinda broken
  onMouseOverToggleNav() {
    if(!this.currentEntityEvent) {
      return
    }

    this.drawer
      .open('program')
      .catch(err => console.error('failed to open drawer, error: ' + err)); // TODO: handle?
  }

  onNewEntityClicked() {
    const dialogRef = this.addEntityDialog.open(NewStorageEntityComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '25vh',
      data: 'Import an entity from (m)optidev',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  private findNode(targetBarcode: string, currentTreeNode: DisplayStorageEntity): DisplayStorageEntity | null {
    if (currentTreeNode.barcode == targetBarcode) {
      return currentTreeNode;
    }

    for (const child of currentTreeNode.children) {
      const found = this.findNode(targetBarcode, child);
      if (found != null) {
        return found;
      }
    }

    return null;
  }

  private simplifyStorageNodes(storageEntity: DisplayStorageEntity): StorageEntityMeta[] {
    let simplifiedNodes = storageEntity.entityType != EntityType.OBJECT ? [storageEntity as StorageEntityMeta] : [];
    storageEntity.children.forEach((childItem) => { simplifiedNodes = simplifiedNodes.concat(this.simplifyStorageNodes(childItem)) });
    return simplifiedNodes;
  }

  private handleWsEvent(event: EntityWsEvent): void {
    const movingEntity    = this.findNode(event.movingBarcode,          this.storageRoot);
    const currentParent   = this.findNode(event.previousParentBarcode,  this.storageRoot);
    const newParentNode   = this.findNode(event.newParentBarcode,       this.storageRoot);
    const newParent       = newParentNode ?? this.DELETE_NODE;

    const change: NodeChange = {
      movingEntity:   movingEntity,
      currentParent:  currentParent,
      newParent:      newParent,
      currentIndex:   event.currentIndex,
      targetIndex:    event.targetIndex,
    };

    this.handleNodeChange(change);
  }

  private static calculateNewIndex(releasedPosition: ScreenPosition, releasedEntity: string, newSiblings: DisplayStorageEntity[]): number {
    const indexOfReleased = newSiblings.findIndex(s => s.barcode === releasedEntity);
    const releaseOffsetPredicate = (indexOfReleased >= 0)
                                  ? (y: number, index: number) => { return y + ((index > indexOfReleased) ? 75 : 0) }
                                  : (y: number, _i: number) => { return y };

    const siblingCount = newSiblings.length;
    for (let i = 0; i < siblingCount; i++) {
      const siblingOverNative = (i > 0 && i < siblingCount) ? newSiblings[i - 1].containerElementRefCache.nativeElement : null;
      const siblingUnderNative = newSiblings[i].containerElementRefCache.nativeElement;

      const siblingOverBound = siblingOverNative?.getBoundingClientRect();
      const siblingUnderBound = siblingUnderNative.getBoundingClientRect();

      const underOverSibling = !siblingOverBound || releasedPosition.y > releaseOffsetPredicate(siblingOverBound.y, i) - siblingOverBound.height * 0.45;
      const overUnderSibling = releasedPosition.y < releaseOffsetPredicate(siblingUnderBound.y, i) + siblingUnderBound.height;

      if (underOverSibling && overUnderSibling) {
        return i;
      }
    }

    return siblingCount;
  }
}
