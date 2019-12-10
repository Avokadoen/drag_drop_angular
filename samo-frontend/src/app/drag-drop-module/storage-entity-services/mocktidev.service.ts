import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, map, retry} from 'rxjs/operators';
import {SamoEntityResponse} from '../model/samo-entity-response';
import {StorageEntity} from '../model/storage-entity';

@Injectable({
  providedIn: 'root'
})
export class MocktidevService {
  readonly RETRY_ATTEMPTS = 2;

  constructor(private http: HttpClient) {}

  // use this for root node maybe
  rootNode: StorageEntity;

  // TODO: cachedCount should be defined in backend for security reasons
  public getWorkArea(): Observable<SamoEntityResponse> {
    const workAreaRequest = this.http
      .get<SamoEntityResponse>(`${environment.backend}mocktidev/getLocation?locationBarcode=RANA`)
      .pipe(
        retry(this.RETRY_ATTEMPTS),
        catchError(this.handleError)
      );

    workAreaRequest.pipe(
      map(r => r.optidevEntity)
    ).subscribe(wa => this.rootNode = wa);

    return workAreaRequest;
  }

  // source: https://www.positronx.io/angular-7-httpclient-http-service/
  handleError(error) {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
