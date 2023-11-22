import { Inject, Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GinsengService } from '../api-service/ginseng-service/ginseng.service';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  url = 'http://localhost:5050/admin';
  constructor(private http: HttpClient,
   ) { 
      }
  getUrlAdmin(){
    return this.url;
  }
  getUrlGinseng(){
    let url_ginseng = this.url + '/ginseng/';
    return url_ginseng;
  }
  getUrlWine(){
    let url_ginseng = this.url + '/wine/';
    return url_ginseng;
  }
  getCodeGinSeng(){
    return 1
  }

}