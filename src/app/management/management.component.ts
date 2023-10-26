import { Component, Inject } from '@angular/core';
import { elementAt } from 'rxjs';
import { AppService } from '../app.service';
import { ManagementGinsengService } from '../management-ginseng.service';
import { Ginseng } from '../ginseng';
@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent {
  ginseng: Ginseng[]|null = null;
  amount= '';
  active : HTMLElement | null = null;
  hide = true;
  iconList = '';
  constructor(private appService: AppService, private mngService: ManagementGinsengService){
    this.iconList = 'chevron_right';
  
  }
  HandleNews(element: any){
    this.appService.demo().subscribe((data: any) =>{
      alert(data);
    })
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
    document.getElementById("ginseng")?.setAttribute("style","color: black;font-weight : 500;");
    this.mngService.getListGinseng().subscribe((data : any)=> {
      this.ginseng = data.ginseng;
      console.log(this.ginseng?.[1].certificate)
      this.amount = data.amount + " loại sâm";
    });
  }
}
