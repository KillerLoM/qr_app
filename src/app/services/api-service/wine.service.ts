import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AppService } from '../app-service/app.service';

@Injectable({
  providedIn: 'root'
})
export class WineService {
  url ='';
  constructor(private service: AppService, private http: HttpClient) { 
    this.url = this.service.getUrlWine();
  }
  getListWine(size: number, page: number): Observable<any>{
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get(this.url +  'get',{params: params}).pipe(
      catchError( error =>{
        return throwError(error);
      })
      );
  }
  getWine(codeWine: string): Observable<any> {
    let params = new HttpParams().set('code',codeWine);
    return this.http.get(this.url + 'get' +'/detail',{params: params}).
    pipe(catchError(error =>{
      return throwError(error);
    }))
  }
  deleteWine(codewine: string): Observable<any> {
    let params = new HttpParams().set('code', codewine);
    return this.http.delete(this.url + 'delete', {params, responseType: 'text'})
    .pipe(catchError((error) => {
      return throwError(error);
    })
  );
  }
}
