import {
  Component,
  ElementRef,
  OnInit,
  Inject,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Certificate } from 'src/app/model/certificate';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from 'src/app/services/app-service/pagination.service';
import { CertiService } from 'src/app/services/api-service/certi.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-certificate-management',
  templateUrl: './certificate-management.component.html',
  styleUrls: ['./certificate-management.component.scss']
})
export class CertificateManagementComponent {
  certificate: Certificate[] | null = null;
  certificateUpdate: Certificate | null = null;
  titleForm: string | null = null;
  footerForm: string | null = null;
  showCalendar = false;
  loading = false;
  img: any;
  amount ='';
  numberOfItems = 10;
  isRender = true;
  name_certi: String | null = 'Tải giấy chứng nhận';
  currentPage = 1;
  size = 0;
  page = 0;
  item1: any;
  item2: any;
  item3: any;
  isSorted = false;
  isNext = false;
  isPrev = false;
  isAdd = false;
  isEdit = false;
  isDisabled = true;
  imagesData : any;
  fileCerti = [];
  inputForm!: FormGroup;
  constructor(    
    @Inject(CertiService) private certificateService: CertiService,
    private pagination: PaginationService,
    private router: Router,

    private toastr: ToastrService
  ){
    this.loading = false;
    this.certificateService.getListCertificate(this.numberOfItems, this.currentPage).subscribe(
      (data: any) => {
        this.certificate = data.certificates;
        this.amount = data.amount + ' giấy chứng nhận';
        this.size = data.amount;
      },
      (error) => {
        this.router.navigate(['']);
      }
    );
    this.setUp();
    }
    setUp() {
      this.pagination.HandleDisable();
      this.imagesData = '';
      this.item1 = this.pagination.item1;
      this.item2 = this.pagination.item2;
      this.item3 = this.pagination.item3;
      this.isNext = this.pagination.isNext;
      this.isPrev = this.pagination.isPrev;
      this.currentPage = this.pagination.currentPage;
      // this.addForm.reset();
      this.GetList(this.currentPage, this.numberOfItems);
      this.isAdd = false;
    }
  GetList(page: number, number: any) {
    page--;
    this.certificateService.getListCertificate(number, page).subscribe(
      (data: any) => {
        this.certificate = data.certificates;
        this.amount = data.amount + ' giấy chứng nhận';
        this.size = data.amount;
      },
      (error) => {
        this.router.navigate(['']);
      }
    );
  }  
  HandleSort(){

  }
  HandleAddCertificate(){
    
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
  
  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }
  HandleDelte(id: number){

  }
  handleUpdate(id: number){

  }
}
