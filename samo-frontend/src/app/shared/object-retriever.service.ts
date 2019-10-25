import { Injectable } from '@angular/core';
import {StorageObjectData} from './models/storage-object-data';
import {Observable, throwError} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import {DeliveryData} from "./models/delivery-data";
import {catchError, retry} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ObjectRetrieverService {

  readonly RETRY_ATTEMPTS = 2;

  constructor(private http: HttpClient) {}

  // TODO: cachedCount should be defined in backend for security reasons
  public getDeliveryBatch(deliveryId: string, pageNumber: number, pageSize: number): Observable<DeliveryData> {
    return this.http
      .get<DeliveryData>(`${environment.backend}getDelivery?deliveryId=${deliveryId}&pageNumber=${pageNumber}` +
      `&pageSize=${pageSize}&sortBy=notused`)
      .pipe(
        retry(this.RETRY_ATTEMPTS),
        catchError(this.handleError)
      );
  }

  public updateDeliveryBatch(deliveryId: string, deliveryData: StorageObjectData) {
    console.log('updateDeliveryBatch is not implemented');
  }

  public getAllOrganisations(): Observable<string[]> {
    return this.http
      .get<string[]>(`${environment.backend}getAllOrganisationIds`)
      .pipe(
        retry(this.RETRY_ATTEMPTS),
        catchError(this.handleError)
      );
  }

  // source: https://www.positronx.io/angular-7-httpclient-http-service/
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // TODO toast
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}

