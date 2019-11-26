import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter, Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {CdkDragDrop, CdkDragMove, CdkDragStart} from "@angular/cdk/drag-drop";
import {StorageEntity} from "../../../model/storage-entity";
import {EntityType} from "../../../model/entity-type.enum";
import {DOCUMENT} from "@angular/common";

// Sources: code is heavily based on Ilya Pakhomov's code that can be found here:
// https://stackblitz.com/edit/angular-cdk-nested-drag-drop-demo
@Component({
  selector: 'app-storage-entity-draggable',
  templateUrl: './storage-entity-draggable.component.html',
  styleUrls: ['./storage-entity-draggable.component.scss']
})
export class StorageEntityDraggableComponent implements OnChanges, OnInit, AfterViewInit {

  @Input() parentEntity?: StorageEntity;
  @Input() storageNode: StorageEntity;
  @Input() allNonObjectBarcodes: string[];

  @Output() entityMove: EventEmitter<CdkDragMove<StorageEntity>>;
  @Output() entityDrop: EventEmitter<CdkDragDrop<StorageEntity>>;

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



  constructor() {
    this.entityDrop = new EventEmitter<CdkDragDrop<StorageEntity>>();
    this.entityMove = new EventEmitter<CdkDragMove<StorageEntity>>();
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

    // fetch new reference as old one is invalid
    this.storageNode.elementRefCache = new ElementRef(document.getElementById(this.storageNode.barcode));
  }

  ngAfterViewInit(): void {
    // we set all children  because of bindings between components
    this.storageNode.elementRefCache = this.storageNode.elementRefCache ?? new ElementRef(document.getElementById(this.storageNode.barcode));
  }

  public onDragDrop(event: CdkDragDrop<StorageEntity>): void {
    this.entityDrop.emit(event);
  }

  public onDragMove(event: CdkDragMove<StorageEntity>): void {
    this.entityMove.emit(event);
  }

}
