import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AppService } from '../app-service/app.service';

@Injectable({
  providedIn: 'root',
})
export class WineService {
  url = '';
  constructor(private service: AppService, private http: HttpClient) {
    this.url = this.service.getUrlWine();
  }
  getListWine(size: number, page: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get(this.url + 'get', { params: params }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  getWine(codeWine: string): Observable<any> {
    let params = new HttpParams().set('code', codeWine);
    return this.http.get(this.url + 'get' + '/detail', { params: params }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  deleteWine(codewine: string): Observable<any> {
    let params = new HttpParams().set('code', codewine);
    return this.http
      .delete(this.url + 'delete', { params, responseType: 'text' })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  addProduct(wine: any, files: File[]): Observable<any> {
    const formData: FormData = new FormData();
    const blob = new Blob([JSON.stringify(wine)], { type: 'application/json' });
    formData.append('wine', blob);
    for (let i = 0; i < Math.min(files.length, 5); i++) {
      formData.append('files', files[i]);
    }
    return this.http
      .post(this.url + 'add', formData, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
  getProduct(code: string): Observable<any> {
    let params = new HttpParams().set('code', code);
    return this.http.get(this.url + 'getProduct', { params: params }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  editWine(wine: any, files: any[] | null = null): Observable<any> {
    const formData: FormData = new FormData();
    const blob = new Blob([JSON.stringify(wine)], { type: 'application/json' });
    formData.append('wine', blob);
    if (files != null) {
      for (let i = 0; i < Math.min(files.length, 5); i++) {
        formData.append('files', files[i]);
      }
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
