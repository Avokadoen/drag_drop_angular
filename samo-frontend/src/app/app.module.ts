import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule, MatPaginatorModule,
  MatSelectModule, MatSortModule,
  MatStepperModule, MatTableModule,
  MatToolbarModule
} from '@angular/material';
import { HeaderComponent } from './fixed-elements/header/header.component';
import { ControlFormComponent } from './storage-object/control-form/control-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExtendedModule, FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import { ObjectRootComponent } from './storage-object/object-root.component';
import { DeliveryListComponent } from './storage-object/delivery-list/delivery-list.component';
// tslint:disable-next-line:max-line-length
import { GenerateRegisterDeliveryComponent } from './storage-object/generate-register-delivery/generate-register-delivery.component';
import {RouterModule, Routes} from '@angular/router';
import { NotFoundPageComponent } from './fixed-elements/not-found-page/not-found-page.component';
import {ObjectRetrieverService} from './shared/object-retriever.service';
import {HttpClientModule} from "@angular/common/http";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { InternalDashboardComponent } from './internal-dashboard/internal-dashboard.component';
import {MatDividerModule} from "@angular/material/divider";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import { ReactiveTestComponent } from './reactive-test/reactive-test.component';
import {CommonModule} from "@angular/common";
import { StringFilterPipe } from './shared/pipes/string-filter.pipe';
import { HttpTableComponent } from './shared/components/http-table/http-table.component';
import { SelectTableRowArrayPipe } from './shared/pipes/select-table-row-array.pipe';
import { FillHeightDirective } from './shared/directories/fill-height.directive';
import { HoverFocusDirective } from './shared/directories/hover-focus.directive';
import { LoadingIndicatorDirective } from './shared/directories/loading-indicator.directive';
import { H3IconAlignDirective } from './shared/directories/h3-icon-align.directive';
import { ScrollRotateDirective } from './shared/directories/scroll-rotate.directive';
import {NewStorageEntityComponent} from "./drag-drop-module/drag-drop-root/new-storage-entity/new-storage-entity.component";
import {WebSocketService} from "./drag-drop-module/web-socket/web-socket.service";
import {EntityDragDropModule} from "./drag-drop-module/entity-drag-drop.module";
import { appRouting } from './app.routing';


const dependencies = [
  BrowserModule,
  HttpClientModule,
  BrowserAnimationsModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  ReactiveFormsModule,
  MatInputModule,
  FlexModule,
  MatSelectModule,
  MatStepperModule,
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  MatCardModule,
  MatCheckboxModule,
  RouterModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatDividerModule,
  MatExpansionModule,
  MatListModule,
  MatSidenavModule,
  ExtendedModule,
  FormsModule,
  CommonModule,
  FlexLayoutModule,
];

@NgModule({
  entryComponents: [ControlFormComponent, NewStorageEntityComponent],
  imports: [
    dependencies,
    appRouting,
    EntityDragDropModule,
  ],
  exports: [
    dependencies,
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    ControlFormComponent,
    ObjectRootComponent,
    DeliveryListComponent,
    GenerateRegisterDeliveryComponent,
    NotFoundPageComponent,
    InternalDashboardComponent,
    ReactiveTestComponent,
    StringFilterPipe,
    HttpTableComponent,
    SelectTableRowArrayPipe,
    FillHeightDirective,
    HoverFocusDirective,
    LoadingIndicatorDirective,
    H3IconAlignDirective,
    ScrollRotateDirective,
    NewStorageEntityComponent,
  ],
  providers: [ObjectRetrieverService, WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
