import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropRootComponent} from './drag-drop-root/drag-drop-root.component';
import { StorageEntityDraggableComponent} from './drag-drop-root/storage-entity-draggable/storage-entity-draggable.component';
import { WebSocketService } from './storage-entity-services/web-socket/web-socket.service';
import {eddRouting} from './entity-drag-drop.routing';
import {MatSidenavModule} from '@angular/material/sidenav';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import {RemoveSelfPipe} from './drag-drop-root/pipes/remove-self.pipe';
import {MatIconModule} from '@angular/material/icon';
import {FlexModule} from '@angular/flex-layout';
import {StorageEntityPanelComponent} from './drag-drop-root/storage-entity-panel/storage-entity-panel.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MocktidevService} from './storage-entity-services/mocktidev.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {StorageRootResolver} from './storage-root-resolver';
import { EventListComponent } from './drag-drop-root/event-list/event-list.component';
import {TextIconAlignDirective} from "./directives/text-icon-align.directive";
import { ConfirmClosePanelComponent } from './confirm-close-panel/confirm-close-panel.component';


@NgModule({
  imports: [
    CommonModule,
    eddRouting,
    MatSidenavModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    FlexModule,
    MatFormFieldModule,
    MatDividerModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    DragDropRootComponent,
    StorageEntityDraggableComponent,
    RemoveSelfPipe,
    StorageEntityPanelComponent,
    EventListComponent,
    TextIconAlignDirective,
    ConfirmClosePanelComponent,
  ],
  exports: [
    DragDropRootComponent,
  ],
  providers: [
    WebSocketService,
    MocktidevService,
    StorageRootResolver
  ],
  entryComponents: [StorageEntityPanelComponent, ConfirmClosePanelComponent]
})
export class EntityDragDropModule { }
