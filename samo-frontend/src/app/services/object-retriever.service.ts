import { Injectable } from '@angular/core';
import {StorageObjectData} from '../models/storage-object-data';
import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ObjectRetrieverService {
  constructor(private http: HttpClient) {}

  // TODO: cachedCount should be defined in backend for security reasons
  public getDeliveryBatch(deliveryId: string, pageNumber: number, pageSize: number): Observable<StorageObjectData[]> {
    return this.http
      .get<StorageObjectData[]>(`${environment.backend}getDelivery?deliveryId=${deliveryId}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
  }

  public updateDeliveryBatch(deliveryId: string, deliveryData: StorageObjectData) {
    console.log('updateDeliveryBatch is not implemented');
  }
}

