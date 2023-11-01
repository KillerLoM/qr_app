import { Component, EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { GetGinsengsService } from 'src/app/services/api-service/ginseng-service/get-ginsengs.service';
import { Ginseng } from '../../../model/ginseng';

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
  page = 0;
  size = 0;
  next = true;
  item1: any;
  item2: number | undefined;
  item3: any | undefined;
  check = document.getElementsByClassName('active-atom');
  isNext = false;
  isPrev = false;
  constructor(@Inject(GetGinsengsService) private getListGinseng: GetGinsengsService) {
    this.getListGinseng.getListGinseng(this.numberOfItems, this.page).subscribe((data: any) => {
      this.ginseng = data.ginseng;
      this.amount = data.amount + " Loại sâm";
      this.size = data.amount;
      this.init();
      this.page = 10;
    });
  }
  HandleDelte(code: any) {
    alert(code);
  }
  HandleClick(value: any) {
    this.numberOfItems = value.target.value;
    this.init();
    this.GetList(this.numberOfItems, this.currentPage);
  }
  init() {
    this.item1 = 1;
    this.page = Math.ceil(this.size / this.numberOfItems);
    this.currentPage = 1;
    let check = document.querySelector('.active-atom');
    check?.classList.remove('active-atom');
    let first = document.querySelector("#first");
    first?.classList.add("active-atom");
    if (this.page == 1) {
      this.item3 = undefined;
      this.item2 = undefined;
    }
    if (this.page == 2) {
      this.item2 = 2;
      this.item3 = undefined;
    }
    if (this.page >= 3) {
      this.item2 = 2;
      this.item3 = '...';
    }
    this.HandleDisable();
  }

  HandleNextPage() {
    this.currentPage++;
    let second = document.getElementById('second');
    let first = document.getElementById('first');
    if (this.page == 2) {
      this.item1 = 1;
      this.item2 = 2;
      this.item3 = undefined;
      this.changeActive(first, second);
    }
    else if (this.currentPage <= 2) {
      this.item1 = 1;
      this.item2 = 2;
      this.item3 = '...';
      this.changeActive(first, second);
    }
    else if (this.currentPage + 1 == this.page) {
      this.item3 = this.page;
      this.item2 = this.currentPage;
      this.item1 = '...';
    }
    else if (this.currentPage === this.page) {
      let third = document.getElementById('third');
      this.changeActive(second, third);
      this.item1 = '...';
      this.item3 = this.page;
      this.item2 = this.page - 1;
    }
    else {
      this.item1 = this.item2;
      this.item2 = this.currentPage;
      this.item3 = '...';
      this.changeActive(first, second);
    }
    this.GetList(this.numberOfItems, this.currentPage);
    this.HandleDisable();
  }
  HandlePrevPage() {
    this.currentPage--;
    let second = document.getElementById('second');
    let first = document.getElementById('first');
    let third = document.getElementById('third');
    if (this.page <= 2) {
      this.changeActive(second, first);
    }
    else if (this.currentPage - 1 === 0) {
      this.changeActive(second, first);
    }
    else if (this.currentPage == this.page - 1) {
      this.changeActive(third, second);
    }
    else {
      this.item1 = this.currentPage - 1;
      this.item2 = this.currentPage;
      this.item3 = '...';
    }
    this.GetList(this.numberOfItems, this.currentPage);
    this.HandleDisable();
  }
  HandleDisable() {
    if (this.page == 1) {
      this.isPrev = true;
      this.isNext = true;
    }
    else if (this.page == 2) {
      if (this.check[0].id == 'first') {
        this.isPrev = true;
        this.isNext = false;
      }
      if (this.check[0].id == 'second') {
        this.isNext = true;
        this.isPrev = false;
      }
    }
    else if (this.page >= 2) {
      this.isNext = false;
      if (this.check[0].id == 'first') {
        this.isPrev = true;
      }
      if (this.check[0].id == 'third') {
        this.isNext = true;
      }
      if (this.check[0].id == 'second') {
        this.isNext = false;
        this.isPrev = false;
      }
    }
  }
  changeActive(item1: any, item2: any) {
    item1?.classList.remove('active-atom');
    item2?.classList.add('active-atom');
  }
  GetList(number: any, page: number){
    page --;
    this.getListGinseng.getListGinseng(number, page).subscribe((data: any) => {
      this.ginseng = data.ginseng;
      console.log(data);
      this.amount = data.amount + " Loại sâm";
      this.size = data.amount;
    });
  }
}
