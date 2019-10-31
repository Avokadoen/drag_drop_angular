import { Injectable } from '@angular/core';
import {StorageObjectData} from './models/storage-object-data';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {DeliveryData} from "./models/delivery-data";
import {catchError, retry, retryWhen} from "rxjs/operators";

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

  public getAllOrganisations(): Observable<string[]> {
    return this.http
      .get<string[]>(`${environment.backend}getAllOrganisationIds`)
      .pipe(
        retry(this.RETRY_ATTEMPTS),
        catchError(this.handleError)
      );
  }

  public registerObject(storageObject: StorageObjectData): Observable<string> {
    return this.http
      .post<string>(`${environment.backend}registerObject`, storageObject)
      .pipe(
        retry(this.RETRY_ATTEMPTS),
        catchError(this.handleError)
      );
  }

  public updateObject(from: StorageObjectData, to: StorageObjectData): Observable<string> {
    return this.http
      .post<string>(`${environment.backend}updateObject`, [from, to])
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
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}

