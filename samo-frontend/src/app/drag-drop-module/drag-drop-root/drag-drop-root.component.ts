import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DisplayStorageEntity, StorageEntity, StorageEntityMeta, UtilityStorageEntity} from '../model/storage-entity';
import {EntityType} from '../model/entity-type.enum';
import {CdkDragDrop, CdkDragMove, moveItemInArray, transferArrayItem, } from '@angular/cdk/drag-drop';
import {ScreenPosition} from '../model/screen-position';
import {DropBehaviourData} from '../model/drop-behaviour-data';
import {MatSidenav} from '@angular/material/sidenav';
import {WebSocketService} from '../storage-entity-services/web-socket/web-socket.service';
import {EntityWsEvent} from '../model/entity-ws-event';
import {takeUntil} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {cdkEventIntoNodeChange, NodeChange} from '../model/node-change-event';
import {ActivatedRoute} from '@angular/router';
import {EntityImportEvent} from '../model/entity-import-event';

enum FindMode {
  SPECIFIC,
  PARENT,
}

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

  constructor(private webSocketService: WebSocketService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar, ) {
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

    const change = cdkEventIntoNodeChange(event, 0, targetIndex);
    this.webSocketService.sendMove(change);
    this.handleNodeChange(change);
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
    if (change.movingEntity.entityType.valueOf() >= change.newParent.entityType.valueOf()) {
      this.snackBar.open(`${change.movingEntity.barcode} cannot be a child of ${change.newParent.barcode}, invalid type relation`, 'ok', {
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

  public onImportNodeRequest(event: EntityImportEvent) {
    for (const importTarget of event.importBarcodes) {
      this.mockImport(importTarget, event.source);
    }
  }

  private mockImport(barcode: string, source: StorageEntity) {
    const parentNode = this.findNode(barcode, this.storageRoot, FindMode.PARENT);

    const change: NodeChange = {
      movingEntity: null,
      currentParent: parentNode,
      newParent: source,
      targetIndex: 0,
    };

    if (parentNode) {
      change.movingEntity = parentNode.children.find(c => c.barcode === barcode);

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

  // TODO: bug you cant just place object in delete area as element is kinda broken
  public onMouseOverToggleNav() {
    if (!this.currentEntityEvent) {
      return;
    }

    this.drawer
      ?.open('program')
      .catch(err => console.error('failed to open drawer, error: ' + err)); // TODO: handle?
  }


  private findNode(targetBarcode: string, currentTreeNode: DisplayStorageEntity, findMode: FindMode): DisplayStorageEntity | null {
    switch (findMode) {
      case FindMode.SPECIFIC:
        if (currentTreeNode.barcode === targetBarcode) {
          return currentTreeNode;
        }
        break;

      case FindMode.PARENT:
        if (currentTreeNode.children.findIndex(c => c.barcode === targetBarcode) >= 0) {
          return currentTreeNode;
        }
        break;
    }

    for (const child of currentTreeNode.children) {
      const found = this.findNode(targetBarcode, child, findMode);
      if (found != null) {
        return found;
      }
    }

    return null;
  }

  private simplifyStorageNodes(storageEntity: DisplayStorageEntity): StorageEntityMeta[] {
    let simplifiedNodes = storageEntity.entityType !== EntityType.OBJECT ? [storageEntity as StorageEntityMeta] : [];
    storageEntity.children.forEach((childItem) => { simplifiedNodes = simplifiedNodes.concat(this.simplifyStorageNodes(childItem)); });
    return simplifiedNodes;
  }

  // TODO: this and created can be merged if we assume that not finding the moving entity to be a new one
  private handleWsMoveEvent(event: EntityWsEvent): void {
    const parentNode    = this.findNode(event.source.barcode, this.storageRoot, FindMode.PARENT);
    const movingNode    = parentNode.children.find(c => c.barcode === event.source.barcode);
    if (!movingNode) {
      return;
    }

    const newParentNode = this.findNode(event.newParentBarcode,     this.storageRoot, FindMode.SPECIFIC);

    // TODO: THIS IS A VERY DANGEROUS ASSUMPTION
    const newParent     = newParentNode ?? this.DELETE_NODE;

    const change: NodeChange = {
      movingEntity:   movingNode,
      currentParent: parentNode,
      newParent,
      targetIndex:    0,
    };

    this.handleNodeChange(change);
  }

  private handleWsCreateEvent(event: EntityWsEvent): void {
    const targetParent                = this.findNode(event.newParentBarcode, this.storageRoot, FindMode.SPECIFIC);
    const createdNode: StorageEntity  =  {
      barcode: event.source.barcode,
      entityType: event.source.entityType as EntityType,
      children: [],
    };

    targetParent.children.splice(1, 0, createdNode);
  }
}
