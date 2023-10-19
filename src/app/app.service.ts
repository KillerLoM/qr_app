import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  url = 'http://localhost:5050/admin'
  constructor(private http: HttpClient) {  }
  onlogin(obj: any): Observable<any> {
    return this.http.post(`${this.url}/authenticate`, obj).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
  resetPassword(obj: any): Observable<any> {
    return this.http.post(`${this.url}/forget-password`, JSON.stringify(obj), {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
    }).pipe(
      catchError(error => {
        
        return throwError(error);
      })
    );
  }
  validateOTP(obj: string): Observable<any> {
    let params = new HttpParams().set('OTP', obj);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
   
    return this.http.post(`${this.url}/verify-account`, params.toString(), { 
      headers, params,  responseType: 'text' })
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }
  setNewPwd(obj: any): Observable<any> {
    return this.http.put(`${this.url}/changePassword`, obj,{
      responseType: 'text',
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
  validateToken(token: any): Observable<any>{
    return this.http.post(`${this.url}/validate-token`,  JSON.stringify(token),{
      responseType: 'text',
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
}