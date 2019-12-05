import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import {MocktidevService} from "./mocktidev/mocktidev.service";
import {SamoEntityResponse} from "./model/samo-entity-response";

@Injectable()
export class StorageRootResolver implements Resolve<Observable<SamoEntityResponse>> {
  constructor(private mocktidevService: MocktidevService) { }

  resolve() {
    return this.mocktidevService.getWorkArea();
  }
}
