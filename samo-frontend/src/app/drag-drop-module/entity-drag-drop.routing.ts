import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {DragDropRootComponent} from './drag-drop-root/drag-drop-root.component';
import {StorageRootResolver} from './storage-root-resolver';

export const eddRoutes: Routes = [
  { path: '', component: DragDropRootComponent, resolve: {samoResponse: StorageRootResolver} }, // default route of the module
];

export const eddRouting: ModuleWithProviders = RouterModule.forChild(eddRoutes);
