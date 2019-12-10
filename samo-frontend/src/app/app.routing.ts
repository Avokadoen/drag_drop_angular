import {RouterModule, Routes} from '@angular/router';
import {InternalDashboardComponent} from './internal-dashboard/internal-dashboard.component';
import {DeliveryListComponent} from './storage-object/delivery-list/delivery-list.component';
import {GenerateRegisterDeliveryComponent} from './storage-object/generate-register-delivery/generate-register-delivery.component';
import {ReactiveTestComponent} from './reactive-test/reactive-test.component';
import {ObjectRootComponent} from './storage-object/object-root.component';
import {NotFoundPageComponent} from './fixed-elements/not-found-page/not-found-page.component';
import {ModuleWithProviders} from '@angular/core';

const appRoutes: Routes = [
  { path: 'dashboard/:user', component: InternalDashboardComponent},
  { path: 'delivery-list/:id', component: DeliveryListComponent},
  { path: 'generate-register', component: GenerateRegisterDeliveryComponent},
  { path: 'drag-drop-demo', loadChildren: './drag-drop-module/entity-drag-drop.module#EntityDragDropModule', },
  { path: 'test', component: ReactiveTestComponent},
  { path: '', pathMatch: 'full', component: ObjectRootComponent},
  { path: '**', component: NotFoundPageComponent},
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
