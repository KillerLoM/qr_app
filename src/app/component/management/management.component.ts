import { Component, Inject, Input } from '@angular/core';
import { elementAt } from 'rxjs';
import { AppService } from '../../services/app-service/app.service';
import { Ginseng } from '../../model/ginseng';
@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent {
  isGinseng = false;
  isOn = false;
  show = '';
  Type = '';
  active : HTMLElement | null = null;
  hide = true;
  iconList = '';
  isWine = false;
  constructor(private appService: AppService){
    this.iconList = 'chevron_right';
    this.Type = " Chào mừng admin đã đến với trang web quản lý sâm. Phía dưới là video hướng dẫn: ";
  }
  HandleNews(element: any){
    const element1 = element;
    console.log(element1.target );
    if(this.active?.className != undefined){
      this.active.classList.remove('active-menu');
      this.hide = true;
      this.iconList = 'chevron_right';
      this.active.classList.remove('active');
    }
    if(element.target.nodeName == 'DIV'){
      this.active = element.target;
    }
    else{
      this.active = element.target.parentNode;
    }
   
    this.active?.classList.add('active');
    console.log(this.active?.className);
  }
  HandleList(element: any){
    this.hide = false;
    this.iconList = 'expand_more';
    if(this.active?.className != undefined){
      this.active.classList.remove('active');
    }
    this.active = document.querySelector('.menu-list') as HTMLElement;
    this.active?.classList.add('active-menu');
   
    console.log(this.active?.className);
  }
  ginsengInput(){
    this.reset();
    this.isGinseng = true;
    this.isOn = true;
    document.getElementById("ginseng")?.setAttribute("style","font-weight : bold;");
  }
  wineInput(){
    this.reset();
    this.isWine = true;
    this.isGinseng = false;
    this.isOn = true;
    document.getElementById("wine")?.setAttribute("style","font-weight : bold;");
  }
  reset(){
    this.isGinseng = false;
    this.isWine = false;
    document.getElementById("ginseng")?.setAttribute("style","font-weight : normal;");
    document.getElementById("wine")?.setAttribute("style","font-weight : normal;");
  }
  public HandleEvent($event: any) : void{
    this.show = $event;
    this.Type  =  'Danh sách Sâm'
  }
}
