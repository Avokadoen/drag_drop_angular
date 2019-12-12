import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {
  DisplayStorageEntity, FindMode,
  findNode,
  StorageEntity,
  StorageEntityMeta,
  UtilityStorageEntity
} from '../model/storage-entity';
import {EntityType} from '../model/entity-type.enum';
import {CdkDragDrop, CdkDragMove, moveItemInArray, transferArrayItem,} from '@angular/cdk/drag-drop';
import {ScreenPosition} from '../model/screen-position';
import {DropBehaviourData, formatIllegalDropMessage} from '../model/drop-behaviour-data';
import {MatSidenav} from '@angular/material/sidenav';
import {WebSocketService} from '../storage-entity-services/web-socket/web-socket.service';
import {EntityWsEvent} from '../model/entity-ws-event';
import {takeUntil} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {cdkEventIntoNodeChange, NodeChange} from '../model/node-change-event';
import {ActivatedRoute} from '@angular/router';
import {EntityImportEvent} from '../model/entity-import-event';
import {ProgmatDelete} from "../model/progmat-delete";

enum Move {
  NEW_PARENT,
  REORDER
}

// TODO: rewrite web socket sync logic to ignore sort only events
@Component({
  selector: 'app-drag-drop-root',
  templateUrl: './drag-drop-root.component.html',
  styleUrls: ['./drag-drop-root.component.scss']
})
export class DragDropRootComponent implements OnInit, OnDestroy {

  public get getSimplifiedTree(): StorageEntityMeta[] {
    // We reverse ids here to respect items nesting hierarchy
    return this.simplifyStorageNodes(this.storageRoot)
      .concat(this.DELETE_NODE)
      .reverse();
  }

  // TODO: this should be in the backend and support pagination and filter/search
  public get getEventList(): EntityWsEvent[] {
    return this.webSocketService.getEventList;
  }

  readonly DELETE_NODE: UtilityStorageEntity = {
    barcode: 'deleteList',
    alias: 'delete list',
    entityType: EntityType.LOCATION,
    hideChildren: false,
    children: [],
  };

  readonly DROP_DELETE_DATA: DropBehaviourData = {
    predicate(item: StorageEntity, _: StorageEntity): boolean {
      return item.children.length <= 0;
    },
    illegalDropMessage: 'Cannot delete an entity with children',
  };

  readonly DROP_MOVE_DATA: DropBehaviourData = {
    predicate(item: StorageEntity, node: StorageEntity): boolean {
      return item.entityType.valueOf() < node.entityType.valueOf() && item.barcode !== node.barcode;
    },
    illegalDropMessage: 'Cannot move an entity of type {0} into an entity of type {1}',
  };

  private readonly DESTROYED$ = new Subject();

  @ViewChild('drawer', {static: false}) drawer: MatSidenav;

  storageRoot: DisplayStorageEntity;

  currentEntityEvent: CdkDragMove<DisplayStorageEntity> | null;
  private failedToLoad: boolean;

  @Output()
  onUndoComplete: Subject<EntityWsEvent>;

  private static calculateNewIndex(releasedPosition: ScreenPosition, newSiblings: DisplayStorageEntity[], moveType: Move): number {
    const siblingCount = newSiblings.length;
    for (let i = 0; i < siblingCount; i++) {
      const siblingNative = newSiblings[i].containerElementRefCache.nativeElement;
      const siblingBound  = siblingNative.getBoundingClientRect();
      const releaseBound  = (moveType === Move.REORDER) ? siblingBound.y + siblingBound.height : siblingBound.y;
      const overSibling   = releasedPosition.y < releaseBound;
      if (overSibling) {
        return i;
      }
    }

    return siblingCount;
  }


  constructor(private webSocketService: WebSocketService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar, ) {
    this.onUndoComplete = new Subject<EntityWsEvent>();
  }

  public ngOnInit() {
    this.webSocketService.CHANGE$
      .asObservable()
      .pipe(
        takeUntil(this.DESTROYED$)
      ).subscribe((wsEvent: EntityWsEvent) => this.handleWsMoveEvent(wsEvent));

    this.webSocketService.CREATED$
      .asObservable()
      .pipe(
        takeUntil(this.DESTROYED$)
      ).subscribe((wsEvent: EntityWsEvent) => this.handleWsCreateEvent(wsEvent));

    const resolve = this.route.snapshot.data.samoResponse;
    if (resolve.errorMessage) {
      this.snackBar.open('Something went wrong while loading work area', 'ok', {
        duration: 20000,
        verticalPosition: 'top',
      });
      this.failedToLoad = true;
    } else {
      this.storageRoot = resolve.optidevEntity;
      this.failedToLoad = false;
    }
  }

  public ngOnDestroy(): void {
    this.DESTROYED$.next();
    this.DESTROYED$.complete();
  }

  public onDragMove(event: CdkDragMove<StorageEntity>) {
    this.currentEntityEvent = event;
  }

  public onDragDrop(event: CdkDragDrop<StorageEntity>) {
    if (!this.currentEntityEvent) {
      return;
    }

    const newParent = event.container.data;
    const moveType  = (newParent.barcode === event.previousContainer.data.barcode) ? Move.REORDER : Move.NEW_PARENT;
    const targetIndex
      = (newParent.barcode !== this.DELETE_NODE.barcode)
      ? DragDropRootComponent.calculateNewIndex(this.currentEntityEvent.pointerPosition, newParent.children as DisplayStorageEntity[], moveType)
      : 0;

    const currentIndex = event.previousContainer.data.children.indexOf(event.item.data);
    if (currentIndex === targetIndex && event.previousContainer.data === event.container.data) {
      return;
    }

    // TODO: check if same container to avoid sending redundant info
    const change = cdkEventIntoNodeChange(event, 0, targetIndex);
    this.webSocketService.sendMove(change);
    this.handleNodeChange(change);
  }

  public onProgmatDelete(event: ProgmatDelete) {
    const movingEntity = event.source;
    const currentParent = findNode(movingEntity.barcode, this.storageRoot, FindMode.PARENT);

    const change: NodeChange = {
      movingEntity: movingEntity,
      currentParent: currentParent,
      newParent: this.DELETE_NODE,
      targetIndex: 0,
    };

    this.webSocketService.sendMove(change);
    this.handleNodeChange(change);
  }


  public onImportNodeRequest(event: EntityImportEvent) {
    for (const importTarget of event.importBarcodes) {
      this.importNode(importTarget, event.source);
    }
  }

  private importNode(barcode: string, source: StorageEntity) {
    const parentNode = findNode(barcode, this.storageRoot, FindMode.PARENT);

    const change: NodeChange = {
      movingEntity: null,
      currentParent: parentNode,
      newParent: source,
      targetIndex: 0,
    };

    if (parentNode) {
      change.movingEntity  = parentNode.children.find(c => c.barcode === barcode);

      if (!this.DROP_DELETE_DATA.predicate(change.movingEntity, null)) {
        this.snackBar.open(formatIllegalDropMessage(this.DROP_DELETE_DATA, change.movingEntity.entityType, source.entityType), 'ok', {
          duration: 20000,
          verticalPosition: 'top',
        });
      }

      this.webSocketService.sendMove(change);
      this.handleNodeChange(change);
    } else {
      const newEntity: StorageEntity = {
        barcode,
        entityType: Math.trunc(Math.random() * source.entityType.valueOf()) as EntityType,
        children: [],
      };

      change.movingEntity = newEntity;

      this.webSocketService.sendCreate(change);
      source.children = source.children.concat(newEntity);
    }
  }

  // TODO: handle undoing a move out of a now deleted container
  public onUndoEvent(event: EntityWsEvent) {
    const currentParent = (event.newParentBarcode !== 'deleteList')
      ? findNode(event.newParentBarcode, this.storageRoot, FindMode.SPECIFIC)
      : null;

    const movingEntity = (event.newParentBarcode !== 'deleteList')
      ? currentParent?.children.find(c => c.barcode === event.source.barcode) ?? findNode(event.source.barcode, this.storageRoot, FindMode.SPECIFIC)
      : {
        barcode: event.source.barcode,
        entityType: event.source.entityType,
        children: [],
      };

    const newParent = (!event.currentParentBarcode) ? this.DELETE_NODE : findNode(event.currentParentBarcode, this.storageRoot, FindMode.SPECIFIC);
    if (!newParent) {
      this.snackBar.open('Failed to undo event. Maybe old parent is deleted?', 'ok', {
        duration: 20000,
        verticalPosition: 'top',
      });
      return;
    }

    const change: NodeChange = {
      movingEntity: movingEntity,
      currentParent: currentParent,
      newParent: newParent, // TODO: DANGEROUS ASSUMPTION
      targetIndex: 0,
    };

    if (event.newParentBarcode !== 'deleteList') {
      if (!change.newParent || !change.currentParent) {
        this.snackBar.open('Failed to undo event!', 'ok', {
          duration: 20000,
          verticalPosition: 'top',
        });
        return;
      }

      this.webSocketService.sendMove(change, true);
      this.handleNodeChange(change);
    } else {
      this.webSocketService.sendCreate(change, true);
      change.newParent.children.splice(0, 0, change.movingEntity);
    }

    this.onUndoComplete.next(event);
  }

  public handleNodeChange(change: NodeChange, currentIndex?: number) {
    // TODO: REFACTOR: these lines are very similar ..
    if (!change.movingEntity || !change.newParent) {
      this.snackBar.open('Entity tree is out of sync, please refresh page!', 'ok', {
        duration: 20000,
        verticalPosition: 'top',
      });

      this.currentEntityEvent = null;
      return;
    }

    if (!this.DROP_MOVE_DATA.predicate(change.movingEntity, change.newParent)) {
      this.snackBar.open(formatIllegalDropMessage(this.DROP_MOVE_DATA, change.movingEntity.entityType, change.newParent.entityType), 'ok', {
        duration: 20000,
        verticalPosition: 'top',
      });

      this.currentEntityEvent = null;
      return;
    }

    const cIndex = currentIndex ?? change.currentParent.children.indexOf(change.movingEntity);

    switch (change.newParent.barcode) {
      case this.DELETE_NODE.barcode:
        change.currentParent.children.splice(cIndex, 1);
        break;
      case change.currentParent.barcode:
        moveItemInArray(change.currentParent.children, cIndex, change.targetIndex);
        break;
      default:
        transferArrayItem(change.currentParent.children, change.newParent.children, cIndex, change.targetIndex);
        break;
    }
    this.currentEntityEvent = null;
  }

  private simplifyStorageNodes(storageEntity: DisplayStorageEntity): StorageEntityMeta[] {
    let simplifiedNodes = storageEntity.entityType !== EntityType.OBJECT ? [storageEntity as StorageEntityMeta] : [];
    storageEntity.children.forEach((childItem) => { simplifiedNodes = simplifiedNodes.concat(this.simplifyStorageNodes(childItem)); });
    return simplifiedNodes;
  }

  private handleWsMoveEvent(event: EntityWsEvent): void {
    const parentNode    = findNode(event.source.barcode, this.storageRoot, FindMode.PARENT);
    const movingNode    = parentNode.children.find(c => c.barcode === event.source.barcode);
    if (!movingNode) {
      return;
    }

    const newParent = (event.newParentBarcode === this.DELETE_NODE.barcode)
                          ? this.DELETE_NODE
                          : findNode(event.newParentBarcode, this.storageRoot, FindMode.SPECIFIC);

    const change: NodeChange = {
      movingEntity:   movingNode,
      currentParent: parentNode,
      newParent,
      targetIndex:    0,
    };

    this.handleNodeChange(change);
  }

  private handleWsCreateEvent(event: EntityWsEvent): void {
    const targetParent                = findNode(event.newParentBarcode, this.storageRoot, FindMode.SPECIFIC);
    const createdNode: StorageEntity  =  {
      barcode: event.source.barcode,
      entityType: event.source.entityType as EntityType,
      children: [],
    };

    targetParent.children.splice(1, 0, createdNode);
  }
}
