import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DisplayStorageEntity, StorageEntity, StorageEntityMeta, UtilityStorageEntity} from "../model/storage-entity";
import {EntityType} from "../model/entity-type.enum";
import {CdkDragDrop, CdkDragMove, moveItemInArray, transferArrayItem,} from "@angular/cdk/drag-drop";
import {ScreenPosition} from "../model/screen-position";
import {DropBehaviourData} from "../model/drop-behaviour-data";
import {MatSidenav} from "@angular/material/sidenav";
import {WebSocketService} from "../web-socket/web-socket.service";
import {EntityWsEvent} from "../model/entity-ws-event";
import {takeUntil} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subject} from "rxjs";
import {cdkEventIntoNodeChange, NodeChange} from "../model/node-change-event";
import {ActivatedRoute} from "@angular/router";

// TODO: rewrite web socket sync logic to ignore sort only events
@Component({
  selector: 'app-drag-drop-root',
  templateUrl: './drag-drop-root.component.html',
  styleUrls: ['./drag-drop-root.component.scss']
})
export class DragDropRootComponent implements OnInit, OnDestroy {

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

  @Input() storageRoot: DisplayStorageEntity;

  currentEntityEvent: CdkDragMove<DisplayStorageEntity> | null;
  private failedToLoad: boolean;

  public get getSimplifiedTree(): StorageEntityMeta[] {
    // We reverse ids here to respect items nesting hierarchy
    return this.simplifyStorageNodes(this.storageRoot)
      .concat(this.DELETE_NODE)
      .reverse();
  }

  constructor(private webSocketService: WebSocketService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,) {
  }

  public ngOnInit() {
    this.webSocketService.CHANGE$
      .asObservable()
      .pipe(
        takeUntil(this.DESTROYED$)
      ).subscribe((wsEvent: EntityWsEvent) => this.handleWsEvent(wsEvent));

    const resolve = this.route.snapshot.data.samoResponse;
    if (resolve.errorMessage) {
      this.snackBar.open('Something went wrong while loading work area','ok', {
        duration: 20000,
        verticalPosition: 'top',
      });
      this.failedToLoad = true;
    } else {
      this.storageRoot = resolve.optidevEntity;
      this.failedToLoad = false;
    }
  }

  public ngOnDestroy (): void {
    this.DESTROYED$.next();
    this.DESTROYED$.complete();
  }

  public onDragMove(event: CdkDragMove<StorageEntity>) {
    this.currentEntityEvent = event;
  }

  public onDragDrop(event: CdkDragDrop<StorageEntity>) {
    const newParent = event.container.data;
    const targetIndex
      = (newParent.barcode !== this.DELETE_NODE.barcode)
      ? DragDropRootComponent.calculateNewIndex(this.currentEntityEvent.pointerPosition, newParent.children as DisplayStorageEntity[])
      : 0;

    const currentIndex = event.previousContainer.data.children.indexOf(event.item.data);
    if (currentIndex === targetIndex && event.previousContainer.data === event.container.data) {
      return;
    }

    const change = cdkEventIntoNodeChange(event, 0, targetIndex);
    this.webSocketService.sendChange(change);
    this.handleNodeChange(change);
  }

  public handleNodeChange(change: NodeChange, currentIndex?: number) {
    if (!change.movingEntity || !change.currentParent || !change.newParent) {
      this.snackBar.open('Entity tree is out of sync, please refresh page!','ok', {
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

  // TODO: bug you cant just place object in delete area as element is kinda broken
  onMouseOverToggleNav() {
    if(!this.currentEntityEvent) {
      return
    }

    this.drawer
      .open('program')
      .catch(err => console.error('failed to open drawer, error: ' + err)); // TODO: handle?
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

    if (currentParent.barcode === newParentNode.barcode) {
      return;
    }

    const newParent       = newParentNode ?? this.DELETE_NODE;
    const change: NodeChange = {
      movingEntity:   movingEntity,
      currentParent:  currentParent,
      newParent:      newParent,
      targetIndex:    0,
    };

    this.handleNodeChange(change);
  }

  /*
    TODO: handling dropping on self.
          Right now it gets shifted down if you drop on self.
          if we offset with height we get bugs with dropping outside of current container
          - maybe an isDroppingOnSelf(): boolean -> dont change index
          - maybe build rectangles between middle of each element in sibling list and check if pointer
            is inside one of the rectangles.
  */
  private static calculateNewIndex(releasedPosition: ScreenPosition, newSiblings: DisplayStorageEntity[]): number {
    const siblingCount = newSiblings.length;
    for (let i = 0; i < siblingCount; i++) {
      const siblingNative = newSiblings[i].containerElementRefCache.nativeElement;
      const siblingBound  = siblingNative.getBoundingClientRect();
      const overSibling   = releasedPosition.y < siblingBound.y;
      if (overSibling) {
        return i;
      }
    }

    return siblingCount;
  }
}
