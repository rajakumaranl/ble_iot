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
export class BLEDasboardService
{

    private devicesUrl = baseAPI +'/available-devices';
    private add_device_url = baseAPI+'/add-device';
    private update_device_url = baseAPI+'/edit-device';
    
    constructor(private http: HttpClient) {}

    private static _handleError(err: HttpErrorResponse | any): Observable<any> {
        return throwError(err.error.message);
    }

    getDevices() {
        return this.http
            .get(this.devicesUrl)
            .pipe(
                map((data: any[]) => {
                    return data;
                })
            )
            .pipe(catchError(error => BLEDasboardService._handleError(error)));
    }

    addDevice(params: any): Observable<any> {
        
        return this.http
        .post(this.add_device_url, {params})
        .pipe(
            map((data: any[]) => {
                return data;
            })
        )
        .pipe(catchError(error => BLEDasboardService._handleError(error)));
    }
    updateDevice(params: any): Observable<any> {
        
        return this.http
        .post(this.update_device_url, {params})
        .pipe(
            map((data: any[]) => {
                return data;
            })
        )
        .pipe(catchError(error => BLEDasboardService._handleError(error)));
    }
}
