import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  url = 'http://localhost:8888/admin/'
  constructor(private http: HttpClient) {  }
  onlogin(obj: any): Observable<any> {
    return this.http.post('http://localhost:5050/admin/authenticate', obj).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
