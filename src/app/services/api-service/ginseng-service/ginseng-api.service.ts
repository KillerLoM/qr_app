import { Injectable } from '@angular/core';
import { AppService } from '../../app-service/app.service';
@Injectable({
  providedIn: 'root'
})
export class GinsengApiService {
  url = '';
  constructor(private service: AppService) { 
    this.url = this.service.getUrlGinseng();
  }
  
}
