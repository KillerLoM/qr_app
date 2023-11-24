import { Injectable } from '@angular/core';
import { AppService } from '../app-service/app.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertiService {
  url = '';
  constructor(private service: AppService, private http: HttpClient) {
    this.url = this.service.getUrlCerti();
  }
  getListCertificate(size: number, page: number): Observable<any> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
  return this.http.get(this.url + 'get', { params: params }).pipe(
    catchError((error) => {
      return throwError(error);
    })
  );
  }
  getCertificate(id: number): Observable<any> {
    let params = new HttpParams().set('id', id);
    return this.http.get(this.url + 'get' + '/detail', { params: params }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  deleteCerti(id: number): Observable<any> {
    let params = new HttpParams().set('id', id);
    return this.http
      .delete(this.url + 'delete', { params, responseType: 'text' })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  addCertificate(certi: any, fileCerti: File, image: File): Observable<any> {
    const formData: FormData = new FormData();
    const blob = new Blob([JSON.stringify(certi)], { type: 'application/json' });
    formData.append('certificate', blob);
    formData.append('fileCerti', fileCerti);
    formData.append('image',image);
    return this.http
    .post(this.url + 'add', formData, { responseType: 'text' })
    .pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  editCertificate(certi: any, fileCerti: any, imageFile: any): Observable<any> {
    const formData: FormData = new FormData();
    const blob = new Blob([JSON.stringify(certi)], { type: 'application/json' });
    formData.append('certificate', blob);
    if(fileCerti && imageFile){
      formData.append('fileCerti', fileCerti);
      formData.append('image',imageFile);
    }
    else if(fileCerti && !imageFile){
      formData.append('fileCerti', fileCerti);
    }
    else if(!fileCerti && imageFile){
      formData.append('image',imageFile);
    }
    else {
      return this.http
      .put(this.url + 'edit', formData, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
    }
    return this.http
      .put(this.url + 'edit', formData, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
