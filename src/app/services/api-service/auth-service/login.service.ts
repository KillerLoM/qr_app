import { Injectable } from '@angular/core';
import { AppService } from '../../app-service/app.service';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = ""; 
  constructor(private http: HttpClient, private service: AppService) {
    this.url = this.service.getUrlAdmin();
   }
   onlogin(obj: any): Observable<any> {
    return this.http.post(`${this.url}/authenticate/authenticate`, obj).pipe();
  }
  validateToken(token: any): Observable<any>{
    return this.http.post(`${this.url}/authenticate/validate-token`,  JSON.stringify(token),{
      responseType: 'text',
      headers: { 'Content-Type': 'application/json' }
    }).pipe();
  }
}
