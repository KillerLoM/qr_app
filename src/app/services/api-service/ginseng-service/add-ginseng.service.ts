import { Injectable } from '@angular/core';
import { AppService } from '../../app-service/app.service';
import { Ginseng } from 'src/app/model/ginseng';

@Injectable({
  providedIn: 'root'
})
export class AddGinsengService {
  url = '';
  constructor(private service: AppService) { 
    this.url = this.service.getUrlGinseng();
  }
  addGinseng(ginseng: Ginseng){
    
  }
}
