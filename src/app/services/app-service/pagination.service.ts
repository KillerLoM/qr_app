import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  numberOfItems = 10;
  currentPage = 1;
  page = 0;
  size = 0;
  next = true;
  item1: any;
  item2: any ;
  item3: any ;
  check = document.getElementsByClassName('active-atom');
  isNext = false;
  isPrev = false;
  constructor() { }
  demo(){
    let a = document.getElementById('first');
    console.log(a);
  }
  init(size: number, numberOfItems: number) {
    this.item1 = 1;
    this.page = Math.ceil(size / numberOfItems);
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
}
