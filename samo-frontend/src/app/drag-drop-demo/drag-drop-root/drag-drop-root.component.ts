import {Component, OnChanges} from '@angular/core';
import {StorageEntity} from "../model/storage-entity";
import {EntityType} from "../model/entity-type.enum";
import {CdkDragDrop, CdkDragEnter, CdkDragExit, moveItemInArray} from "@angular/cdk/drag-drop";

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
            },
            {
              barcode: 'object2',
              children: [],
              entityType: EntityType.OBJECT,
            }
          ],
          entityType: EntityType.PALLET,
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
                },
                {
                  barcode: 'box1',
                  children: [
                    {
                      barcode: 'object6',
                      children: [],
                      entityType: EntityType.OBJECT,
                    },
                  ],
                  entityType: EntityType.BOX,
                }],
              entityType: EntityType.CRATE,
            }],
          entityType: EntityType.PALLET
        },
        {
          barcode: 'object5',
          children: [],
          entityType: EntityType.OBJECT,
        },
        {
          barcode: 'object4',
          children: [],
          entityType: EntityType.OBJECT,
        }
      ],
      entityType: EntityType.LOCATION
    };

  public get allNonObjectBarcodes(): string[] {
    // We reverse ids here to respect items nesting hierarchy
    return this.getBarcodesRecursive(this.storageEntities).reverse();
  }

  constructor() { }

  ngOnChanges() {
    // TODO: generate allObjectBarcodes
    // TODO: update accept new objects from service
  }

  public onDragDrop(event: CdkDragDrop<StorageEntity>) {
    // TODO: sort on drop, validate relation
    if (this.canBeDropped(event)) {
      const movingEntity: StorageEntity = event.item.data;
      event.container.data.children.push(movingEntity);
      event.previousContainer.data.children = event.previousContainer.data.children.filter((child) => child.barcode !== movingEntity.barcode);
    } else {
      moveItemInArray(
        event.container.data.children,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  private getBarcodesRecursive(storageEntity: StorageEntity): string[] {
    let barcodes = storageEntity.entityType != EntityType.OBJECT ? [storageEntity.barcode] : [];
    storageEntity.children.forEach((childItem) => { barcodes = barcodes.concat(this.getBarcodesRecursive(childItem)) });
    return barcodes;
  }

  private canBeDropped(event: CdkDragDrop<StorageEntity, StorageEntity>): boolean {
    const movingItem: StorageEntity = event.item.data;

    return movingItem.entityType < event.container.data.entityType
      && event.previousContainer.id !== event.container.id
      && this.isNotSelfDrop(event)
      && !this.hasChild(movingItem, event.container.data);
  }

  private isNotSelfDrop(event: CdkDragDrop<StorageEntity> | CdkDragEnter<StorageEntity> | CdkDragExit<StorageEntity>): boolean {
    return event.container.data.barcode !== event.item.data.barcode;
  }

  private hasChild(parentItem: StorageEntity, childItem: StorageEntity): boolean {
    const hasChild = parentItem.children.some((entity) => entity.barcode === childItem.barcode);
    return hasChild ? true : parentItem.children.some((item) => this.hasChild(item, childItem));
  }
}
