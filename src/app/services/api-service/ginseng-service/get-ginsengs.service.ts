import { Injectable } from '@angular/core';
import { AppService } from '../../app-service/app.service';
import { Ginseng } from 'src/app/model/ginseng';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetGinsengsService {
  url = '';
  constructor(private service: AppService, private http: HttpClient) { 
    this.url = this.service.getUrlGinseng();
  }
  getListGinseng(size: number, page: number): Observable<any>{
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get(this.url + 'get',{params: params}).pipe(
      catchError( error =>{
        return throwError(error);
      })
      );
  }
}
