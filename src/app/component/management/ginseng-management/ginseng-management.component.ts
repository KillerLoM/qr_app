import { Component, EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { GetGinsengsService } from 'src/app/services/api-service/ginseng-service/get-ginsengs.service';
import { Ginseng } from '../../../model/ginseng';
import { PaginationService } from 'src/app/services/app-service/pagination.service';
@Component({
  selector: 'app-ginseng-management',
  templateUrl: './ginseng-management.component.html',
  styleUrls: ['./ginseng-management.component.scss']
})
export class GinsengManagementComponent {
  ginseng: Ginseng[] | null = null;
  amount = '';
  numberOfItems = 10;
  currentPage = 1;
  size = 0;
  page = 0;
  next = true;
  item1: any;
  item2: any ;
  item3: any ;
  isSorted = false;
  check = document.getElementsByClassName('active-atom');
  isNext = false;
  isPrev = false;
  constructor(@Inject(GetGinsengsService) private getListGinseng: GetGinsengsService, private pagination: PaginationService) {
    this.getListGinseng.getListGinseng(this.numberOfItems, 0).subscribe((data: any) => {
      this.ginseng = data.ginsengs;
      console.log(this.ginseng?.length);
      if(this.ginseng == null){

      }
      else{
        for(let i of this.ginseng){
          console.log(i.code);
          console.log(i.name);
          console.log(i?.created_date);
        }
      }
      this.amount = data.amount + " Loại sâm";
      this.size = data.amount;
      this.pagination.init(this.size, this.numberOfItems);
      this.setUp(); 
    });
  }
  HandleDelte(code: any) {
    alert(code);
  }
  HandleClick(value: any) {
    this.numberOfItems = value.target.value;
    this.pagination.init(this.size, this.numberOfItems);
    this.setUp();
  }
  HandleNextPage() {
    this.pagination.HandleNextPage();
    this.setUp();
  }
  HandlePrevPage() {
    this.pagination.HandlePrevPage();
    this.setUp();
  }
  GetList(page: number, number: any ){
    page--;
    this.getListGinseng.getListGinseng(number, page).subscribe((data: any) => {
      this.ginseng = data.ginsengs;
      console.log(this.ginseng);
      this.amount = data.amount + " Loại sâm";
      this.size = data.amount;
    });
  }
  setUp(){
    this.pagination.HandleDisable();
    this.item1 = this.pagination.item1;
    this.item2 = this.pagination.item2;
    this.item3 = this.pagination.item3;
    this.isNext = this.pagination.isNext;
    this.isPrev = this.pagination.isPrev;
    this.currentPage = this.pagination.currentPage;
    this.GetList( this.currentPage, this.numberOfItems);
  }
  HandleSort(){
    if(this.isSorted){
      this.ginseng?.sort((a,b) => a.code.toString().localeCompare(b.code.toString()));
      this.isSorted = false;
    }
    else{
      this.ginseng?.sort((a,b) => a.name.toString().localeCompare(b.name.toString()));
      this.isSorted = true;
    }
  }
  HandleAddGinseng(){
    alert(1);
  }
}
