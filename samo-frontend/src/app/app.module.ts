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
import {ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
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

const appRoutes: Routes = [
  { path: 'dashboard/:user', component: InternalDashboardComponent},
  { path: 'delivery-list/:id', component: DeliveryListComponent},
  { path: 'generate-register', component: GenerateRegisterDeliveryComponent},
  { path: '', pathMatch: 'full', component: ObjectRootComponent},
  { path: '**', component: NotFoundPageComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ControlFormComponent,
    ObjectRootComponent,
    DeliveryListComponent,
    GenerateRegisterDeliveryComponent,
    NotFoundPageComponent,
    InternalDashboardComponent,
  ],
  entryComponents: [ControlFormComponent],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // <-- debugging purposes only
    ),
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
  ],
  providers: [ObjectRetrieverService],
  bootstrap: [AppComponent]
})
export class AppModule { }
