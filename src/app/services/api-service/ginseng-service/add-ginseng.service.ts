import { Injectable } from '@angular/core';
import { AppService } from '../../app-service/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddGinsengService {
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

    return this.http.post(this.url + 'add', formData,{responseType: 'text'})
    .pipe(catchError((error) => {
      return throwError(error);
    })
  );
  }
}
