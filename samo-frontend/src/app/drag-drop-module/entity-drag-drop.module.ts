import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropRootComponent} from "./drag-drop-root/drag-drop-root.component";
import { StorageEntityDraggableComponent} from "./drag-drop-root/storage-entity-draggable/storage-entity-draggable.component";
import { WebSocketService } from "./web-socket/web-socket.service";
import {eddRouting} from "./entity-drag-drop.routing";
import {MatSidenavModule} from "@angular/material/sidenav";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatButtonModule} from "@angular/material/button";
import {RemoveSelfPipe} from "./drag-drop-root/pipes/remove-self.pipe";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  imports: [
    CommonModule,
    eddRouting,
    MatSidenavModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [
    DragDropRootComponent,
    StorageEntityDraggableComponent,
    RemoveSelfPipe,
  ],
  exports: [
    DragDropRootComponent,
  ],
  providers: [
    WebSocketService
  ]
})
export class EntityDragDropModule { }
