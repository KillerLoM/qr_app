import { Injectable } from '@angular/core';
import { AppService } from '../../app-service/app.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {
    url = ""; 
    constructor(private http: HttpClient, private service: AppService){
        this.url = this.service.getUrlAdmin();
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

}