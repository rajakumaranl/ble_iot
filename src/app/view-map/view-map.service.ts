import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const baseAPI = 'http://localhost:3000';
// const baseAPI = 'http://edfe202a740f.ngrok.io';
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

    getPosition(mac_address: string) {
        const params = new HttpParams()
        .set("mac_address",mac_address)

        return this.http
            .get(this.devicesUrl, {params})
            .pipe(
                map((data: any[]) => {
                    return data;
                })
            )
            .pipe(catchError(error => ViewMapService._handleError(error)));
    }

    getHistory(mac_address: string){
        const params = new HttpParams()
        .set("mac_address",mac_address)

        return this.http
            .get(this.devicesHistoryUrl, {params})
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
