import {Component, OnChanges} from '@angular/core';
import {StorageEntity} from "../../model/storage-entity";
import {EntityType} from "../../model/entity-type.enum";
import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  CdkDragMove,
} from "@angular/cdk/drag-drop";
import {ScreenPosition} from "../../model/screen-position";

@Component({
  selector: 'app-drag-drop-root',
  templateUrl: './drag-drop-root.component.html',
  styleUrls: ['./drag-drop-root.component.css']
})
export class DragDropRootComponent implements OnChanges {

  // TODO: remove/move test data
  storageEntities: StorageEntity =
    {
      barcode: 'Work area',
      children: [
        {
          barcode: 'pallet1',
          children: [
            {
              barcode: 'object1',
              children: [],
              entityType: EntityType.OBJECT,
              elementRefCache: null,
            },
            {
              barcode: 'object2',
              children: [],
              entityType: EntityType.OBJECT,
              elementRefCache: null,
            }
          ],
          entityType: EntityType.PALLET,
          elementRefCache: null,
        },
        {
          barcode: 'pallet2',
          children: [
            {
              barcode: 'crate1',
              children: [
                {
                  barcode: 'object3',
                  children: [],
                  entityType: EntityType.OBJECT,
                  elementRefCache: null,
                },
                {
                  barcode: 'box1',
                  children: [
                    {
                      barcode: 'object6',
                      children: [],
                      entityType: EntityType.OBJECT,
                      elementRefCache: null,
                    },
                  ],
                  entityType: EntityType.BOX,
                  elementRefCache: null,
                }],
              entityType: EntityType.CRATE,
              elementRefCache: null,
            }],
          entityType: EntityType.PALLET,
          elementRefCache: null,
        },
        {
          barcode: 'object5',
          children: [],
          entityType: EntityType.OBJECT,
          elementRefCache: null,
        },
        {
          barcode: 'object4',
          children: [],
          entityType: EntityType.OBJECT,
          elementRefCache: null,
        }
      ],
      entityType: EntityType.LOCATION,
      elementRefCache: null,
    };

  // TODO: refactor this nasty hack
  //      - as of now we take a drag move and store it, as user drop we use move to find the new index of the entity in parent
  currentEntityEvent: CdkDragMove<StorageEntity>;

  public get allNonObjectBarcodes(): string[] {
    // We reverse ids here to respect items nesting hierarchy
    return this.getBarcodesRecursive(this.storageEntities).reverse();
  }

  constructor() { }

  ngOnChanges() {
    // TODO: generate allObjectBarcodes
    // TODO: update accept new objects from service
  }

  public onDragMove(event: CdkDragMove<StorageEntity>) {
    this.currentEntityEvent = event;
  }

  public onDragDrop(event: CdkDragDrop<StorageEntity>) {
    const movedEntity: StorageEntity = event.item.data;
    // TODO: replace event with dom cursor position?
    const newIndex = this.calculateNewIndex(this.currentEntityEvent.pointerPosition, movedEntity.barcode, event.container.data.children);
    if (this.canBeDropped(event)) {
      event.previousContainer.data.children = event.previousContainer.data.children.filter((child) => child.barcode !== movedEntity.barcode);
      event.container.data.children.splice(newIndex, 0, movedEntity);
    }
    this.currentEntityEvent = null;
  }

  private calculateNewIndex(releasedPosition: ScreenPosition, releasedEntity: string, newSiblings: StorageEntity[]): number {
    let index = 0;
    for (const sibling of newSiblings) {
      if (sibling.barcode === releasedEntity) {
        continue;
      }
      const siblingRect = sibling.elementRefCache.nativeElement.getBoundingClientRect();
      if (siblingRect.top > releasedPosition.y) {
        return index;
      }
      index++;
    }
    return index;
  }

  private getBarcodesRecursive(storageEntity: StorageEntity): string[] {
    let barcodes = storageEntity.entityType != EntityType.OBJECT ? [storageEntity.barcode] : [];
    storageEntity.children.forEach((childItem) => { barcodes = barcodes.concat(this.getBarcodesRecursive(childItem)) });
    return barcodes;
  }

  private canBeDropped(event: CdkDragDrop<StorageEntity, StorageEntity>): boolean {
    const movingItem: StorageEntity = event.item.data;

    return movingItem.entityType < event.container.data.entityType
      && this.isNotSelfDrop(event)
  }

  private isNotSelfDrop(event: CdkDragDrop<StorageEntity> | CdkDragEnter<StorageEntity> | CdkDragExit<StorageEntity>): boolean {
    return event.container.data.barcode !== event.item.data.barcode;
  }

  private hasChild(parentItem: StorageEntity, childItem: StorageEntity): boolean {
    const hasChild = parentItem.children.some((entity) => entity.barcode === childItem.barcode);
    return hasChild ? true : parentItem.children.some((item) => this.hasChild(item, childItem));
  }
}
