import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {catchError, retry} from "rxjs/operators";
import {SamoEntityResponse} from "../model/samo-entity-response";

@Injectable({
  providedIn: 'root'
})
export class MocktidevService {
  readonly RETRY_ATTEMPTS = 2;

  constructor(private http: HttpClient) {}

  // TODO: cachedCount should be defined in backend for security reasons
  public getWorkArea(): Observable<SamoEntityResponse> {
    return this.http
      .get<SamoEntityResponse>(`${environment.backend}mocktidev/getLocation?locationBarcode=RANA`)
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
    return throwError(errorMessage);
  }
}
