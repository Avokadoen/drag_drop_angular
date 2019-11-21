import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {StorageEntity} from "../model/storage-entity";
import {EntityType} from "../model/entity-type.enum";

// Sources: code is heavily based on Ilya Pakhomov's code that can be found here:
// https://stackblitz.com/edit/angular-cdk-nested-drag-drop-demo
@Component({
  selector: 'app-storage-entity-draggable',
  templateUrl: './storage-entity-draggable .component.html',
  styleUrls: ['./storage-entity-draggable .component.scss']
})
export class StorageEntityDraggableComponent implements OnChanges, OnInit {

  @Input() parentEntity?: StorageEntity;
  @Input() storageNode: StorageEntity;
  @Input() allNonObjectBarcodes: string[];



  public get dragDisabled(): boolean {
    return !this.parentEntity;
  }

  public get parentEntityId(): string {
    return this.parentEntity?.barcode ?? '';
  }

  public get getChildCount(): number {
    return this.storageNode.children?.length ?? 0;
  }

  public get isObjectType(): boolean {
    return this.storageNode.entityType == EntityType.OBJECT;
  }

  backgroundColor: string;


  @Output() entityDrop: EventEmitter<CdkDragDrop<StorageEntity>>;

  constructor() {
    this.entityDrop = new EventEmitter<CdkDragDrop<StorageEntity>>();
  }

  ngOnInit(): void {
    switch (this.storageNode.entityType) {
      case EntityType.OBJECT:
        this.backgroundColor = 'rgb(155, 209, 232, 0.8)';
        break;
      case EntityType.BOX:
        this.backgroundColor = 'rgb(175, 155, 232, 0.8)';
        break;
      case EntityType.CRATE:
        this.backgroundColor = 'rgb(230, 173, 232, 0.8)';
        break;
      case EntityType.PALLET:
        this.backgroundColor = 'rgb(232, 173, 173, 0.8)';
        break;
      case EntityType.LOCATION:
        this.backgroundColor = 'rgb(232, 208, 173, 0.8)';
        break;
    }
  }

  ngOnChanges() {
    // update table
  }

  public onDragDrop(event: CdkDragDrop<StorageEntity, StorageEntity>): void {
    this.entityDrop.emit(event);
  }
}
