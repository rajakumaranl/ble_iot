import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const baseAPI = 'http://localhost:3000';
const httpOption = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

@Injectable({
    providedIn: 'root',
}
)
export class ViewMapService
{

    private devicesUrl = baseAPI +'/device-position';
    private devicesHistoryUrl = baseAPI +'/device-position/history';
    constructor(private http: HttpClient) {}

    private static _handleError(err: HttpErrorResponse | any): Observable<any> {
        return throwError(err.error.message);
    }

    getPosition() {
        return this.http
            .get(this.devicesUrl)
            .pipe(
                map((data: any[]) => {
                    return data;
                })
            )
            .pipe(catchError(error => ViewMapService._handleError(error)));
    }

    getHistory(){
        return this.http
            .get(this.devicesHistoryUrl)
            .pipe(
                map((data: any[]) => {
                    return data;
                })
            )
            .pipe(catchError(error => ViewMapService._handleError(error)));
    }

    addDevice(params: any): Observable<any> {
        
        return this.http
        .post(this.devicesUrl, {params})
        .pipe(
            map((data: any[]) => {
                return data;
            })
        )
        .pipe(catchError(error => ViewMapService._handleError(error)));
    }
}
