import {RouterModule, Routes} from "@angular/router";
import {DragDropRootComponent} from "./drag-drop-root/drag-drop-root.component";
import {ModuleWithProviders} from "@angular/core";

export const eddRoutes: Routes = [
  { path: '', component: DragDropRootComponent }, // default route of the module
];

export const eddRouting: ModuleWithProviders = RouterModule.forChild(eddRoutes);
