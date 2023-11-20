import {
  Component,
  Renderer2,
  ElementRef,
  OnInit,
  Inject,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { GinsengService } from 'src/app/services/api-service/ginseng-service/ginseng.service';
import { WineService } from 'src/app/services/api-service/wine.service';
import { Ginseng } from '../../../model/ginseng';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { PaginationService } from 'src/app/services/app-service/pagination.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Wine } from 'src/app/model/wine';


@Component({
  selector: 'app-wine-management',
  templateUrl: './wine-management.component.html',
  styleUrls: ['./wine-management.component.scss']
})
export class WineManagementComponent {
  wine: Wine[] | null = null;
  wineUpdate: Wine | null = null;
  amount ='';
  numberOfItems = 10;
  isSorted = 1;
  isNext = false;
  status = '';
  isPrev = false;
  isEdit = false;
  size = 0;
  item1: any;
  item2: any;
  item3: any;
  isAdd = false;
  currentPage = 1;
  HandleSort() {
    if (this.isSorted == 1) {
      this.wine?.sort((a, b) =>
        a.codewine.toString().localeCompare(b.codewine.toString())
      );
      this.isSorted = this.isSorted + 1;
    } 
    if (this.isSorted == 2) {
      this.wine?.sort((a, b) =>
        a.namewine.toString().localeCompare(b.namewine.toString())
      );
      this.isSorted = this.isSorted  +1;
    }
    if (this.isSorted == 3) {
      this.wine?.sort((a, b) =>
        a.created_date.toString().localeCompare(b.created_date.toString())
      );
      this.isSorted = this.isSorted  - 2;
    }
  }
  HandleAddOrEdit(){

  }
  constructor(
    @Inject(WineService) private wineService: WineService,
    private pagination: PaginationService, )
    {
      this.wineService.getListWine(this.numberOfItems, 0).subscribe((data: any) =>{
        this.wine = data.wines;
        this.amount = data.amount + ' Sản phẩm';
        this.size = data.amount;
        this.pagination.init(this.size, this.numberOfItems);
        console.log(this.wine)
      })

    }
    GetList(page: number, number: any) {
      page--;
      this.wineService.getListWine(number, page).subscribe(
        (data: any) => {
          this.wine = data.wines;
          this.amount = data.amount + ' Loại sâm';
          this.size = data.amount;
        },
        (error) => {
          console.log(error);
        }
      );
    }
    HandleDelte(id: any){
      alert(id);
    }
    handleUpdate(id: any){
      alert(id);
    }
    HandleNextPage() {
      this.pagination.HandleNextPage();
      this.setUp();
    }
  
    HandlePrevPage() {
      this.pagination.HandlePrevPage();
      this.setUp();
    }
    HandleClick(value: any) {
      this.numberOfItems = value.target.value;
      this.pagination.init(this.size, this.numberOfItems);
      this.setUp();
    }
    setUp() {
    
      this.pagination.HandleDisable();
      // this.imagesArray = [];
      // this.imagesData = [];
      // this.imagesEdit = [];
      this.item1 = this.pagination.item1;
      this.item2 = this.pagination.item2;
      this.item3 = this.pagination.item3;
      this.isNext = this.pagination.isNext;
      this.isPrev = this.pagination.isPrev;
      this.currentPage = this.pagination.currentPage;
      this.GetList(this.currentPage, this.numberOfItems);
      this.isAdd = false;
      // this.name_certi = 'Tải giấy chứng nhận lên'
    }
}
