import { Injectable } from '@angular/core';
import { AppService } from '../../app-service/app.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GinsengService {
  url = '';

  constructor(private service: AppService, private http: HttpClient) { 
    this.url = this.service.getUrlGinseng();
  }

  addGinseng(ginseng: any, files: File[], certi: File): Observable<any> {
    const formData: FormData = new FormData();

    // Tạo một Blob từ dữ liệu JSON và đặt Content-Type là application/json
    const blob = new Blob([JSON.stringify(ginseng)], { type: 'application/json' });

    // Thêm Blob vào FormData
    formData.append('ginseng', blob);

    for (let i = 0; i < Math.min(files.length, 5); i++) {
      formData.append('files', files[i]);
    }
    formData.append('file', certi);
    console.log(formData);
    return this.http.post(this.url + 'add', formData,{responseType: 'text'})
    .pipe(catchError((error) => {
      return throwError(error);
    })
  );
  }
  deleteGinseng(id: number): Observable<any> {
    let params = new HttpParams().set('id', id);
    return this.http.delete(this.url + 'delete', {params, responseType: 'text'})
    .pipe(catchError((error) => {
      return throwError(error);
    })
  );
  }
  getListGinseng(size: number, page: number): Observable<any>{
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get(this.url + 'get',{params: params}).pipe(
      catchError( error =>{
        return throwError(error);
      })
      );
  }
  getGinseng(id: number): Observable<any>{
    let params = new HttpParams().set('id',id);
    return this.http.get(this.url + 'get' +'/detail',{params: params}).
    pipe(catchError(error =>{
      return throwError(error);
    }))
  }
  editGinseng(ginseng: any, files: any[] | null = null, certi: any): Observable<any> {
    
    const formData: FormData = new FormData();
    const blob = new Blob([JSON.stringify(ginseng)], { type: 'application/json' });
    formData.append('ginseng', blob);
    if(files != null && certi != null){
      for (let i = 0; i < Math.min(files.length, 5); i++) {
        formData.append('files', files[i]);
      }
      console.log(formData);
      formData.append('file', certi);
      return this.http.put(this.url + 'edit', formData,{responseType: 'text'}).pipe(catchError((error) => {
        return throwError(error);
      })
    );
    }
    else if(certi!= null){
      formData.append('file', certi);
      return this.http.put(this.url + 'edit', formData,{responseType: 'text'}).pipe(catchError((error) => {
        return throwError(error);
      })
    );
    }
    else if(files != null){
      for (let i = 0; i < Math.min(files.length, 5); i++) {
        formData.append('files', files[i]);
      }
      console.log(formData);
      return this.http.put(this.url + 'edit', formData,{responseType: 'text'}).pipe(catchError((error) => {
        return throwError(error);
      })
    );
    }
    else {
      return this.http.put(this.url + 'edit', formData,{responseType: 'text'})}

  }
  getCodeGinseng() : Observable<any> {
    return this.http.get(this.url + 'get' + '/code').pipe()
  }
}
