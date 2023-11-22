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
import { AppService } from 'src/app/services/app-service/app.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-wine-management',
  templateUrl: './wine-management.component.html',
  styleUrls: ['./wine-management.component.scss'],
  providers: [DatePipe],
})
export class WineManagementComponent implements OnInit {
  wine: Wine[] | null = null;
  wineUpdate: Wine | null = null;

  imagesArray: any[] | null = null;
  imagesData: any[] | null = null;
  imagesEdit: any[] | null = null;
  allowDropImages = true;

  loading = false;
  showCalendar = false;
  isRender = true;
  isDelete = false;
  isAdd = false;
  selected: Date | null = null;
  ArrayGinseng: any[] | null = null;
  amount = '';
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
  currentPage = 1;
  unitValue: number = 0;
  newValue : number = 0;
  codeWine: any;
  titleForm = '';
  footerForm = '';
  inputForm!: FormGroup;
  https: any;
  isML = true;
  display = ' ';

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
      this.isSorted = this.isSorted + 1;
    }
    if (this.isSorted == 3) {
      this.wine?.sort((a, b) =>
        a.created_date.toString().localeCompare(b.created_date.toString())
      );
      this.isSorted = this.isSorted - 2;
    }
  }
  HandleAdd() {
    
    this.titleForm = 'Tạo mới sản phẩm';
    this.footerForm = 'Thêm';

    console.log(this.ArrayGinseng);
    this.isAdd = true;
  }
  constructor(
    @Inject(WineService) private wineService: WineService,
    private pagination: PaginationService,
    private router: Router,
    private toastr: ToastrService,
    private appService: AppService,
    private http: HttpClient,
    private datePipe: DatePipe,
  ) {

    this.wineService
      .getListWine(this.numberOfItems, 0)
      .subscribe((data: any) => {
        this.wine = data.wines;
        this.amount = data.amount + ' Sản phẩm';
        this.size = data.amount;
        this.display = this.newValue + " cc";
        this.pagination.init(this.size, this.numberOfItems);
        this.http.get('http://localhost:5050/admin/ginseng/get/code').subscribe((data: any) => {
          this.ArrayGinseng = data;
        })
        this.setUp();
      });

  }
  ngOnInit() {
    this.inputForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      unit: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
      effect: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required])
    });
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
        this.router.navigate(['']);
      }
    );
  }
  HandleDelte(code: any) {
    this.codeWine = code;
    if (this.isDelete) {
      this.wineService.deleteWine(code).subscribe((data) => {
        if (data === 'DELETED') {
          this.toastr.success('Sản phẩm đã được xóa.');
          this.isDelete = false;
          this.setUp();
        }
      });
    }
    this.isDelete = true;
  }
  handleUpdate(id: any) {
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
  handleChoseGinsengCode(event: any){
    let value = event.target.value;
    let input = document.getElementById("inputCodeGinseng") as HTMLInputElement;
    if(input){
      input.value = value;
    }
  }
  getFileNameFromPath(filePath: string): string {
    let url_new;
    try {
      const url = new URL(filePath);
      url_new = url.pathname.split('\\fakepath\\').pop() || '';
      if (url_new.length > 24) {
        url_new = url_new.substring(0, 15) + '...' + url_new.slice(-4);
      }
    } catch (_) {
      url_new = filePath.replace('/assets/certificate/ginseng/', '');
      if (url_new.length > 24) {
        url_new = url_new.substring(0, 15) + '...' + url_new.slice(-4);
      }
      return url_new;
    }
    return url_new;
  }
  setUp() {
    this.pagination.HandleDisable();
    this.imagesArray = [];
    this.imagesData = [];
    this.imagesEdit = [];
    this.item1 = this.pagination.item1;
    this.item2 = this.pagination.item2;
    this.item3 = this.pagination.item3;
    this.isNext = this.pagination.isNext;
    this.isPrev = this.pagination.isPrev;
    this.currentPage = this.pagination.currentPage;
    this.GetList(this.currentPage, this.numberOfItems);

    
    this.isAdd = false;
  }
  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }
  formatDate(date: Date | null): any {
    return date ? this.datePipe.transform(date, 'dd/MM/yyyy') : '';
  }
  
  onDateSelected(date: Date) {
    this.selected = date;
    this.showCalendar = false;
    let temp = document.getElementById('date') as HTMLInputElement;
    temp.value = this.formatDate(date);
  }
  uploadImage(){
    var button = document.getElementById('button');
    button?.click();
  }
  processImageFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgUrl = reader.result as string;
      this.imagesArray?.push(imgUrl);
      if (this.imagesArray?.length == 5) {
        this.isRender = false;
        var drag = document.getElementById('drag');
        drag?.classList.add('disabled-image');
        drag?.setAttribute(
          'style',
          '-webkit-user-drag: none; user-drag: none; moz-user-drag: none'
        );
        this.allowDropImages = false;
      }
    };
    reader.readAsDataURL(file);
  }
  handleDragEnter(event: any){

  }
  allowDrop(event: any){

  }
  handleImageDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.allowDropImages) {
      return;
    }
    const element = event.target as HTMLElement;
    element.classList.remove('drag-over');
    const files = event.dataTransfer?.files;

    if (files != null) {
      if (files.length > 0) {
        const imageFile = files[0];
        this.processImageFile(imageFile);
      }
    }
    if (!this.isRender) {
      return;
    }
  }
  handleUploadImage(event: any) {
    const check = document.getElementById('image-render');
    const addSvg = document.getElementById('Add');
    const reader = new FileReader();

    reader.onload = (e) => {
      const imgUrl = reader.result;
      var base64String = e.target?.result;
      var mimeType = (base64String as string).match(
        /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/
      );
      let type = ['image/png', 'image/jpg', 'image/jpeg', 'image/ico'];
      let length: any;
      length = this.imagesArray?.length;
      if (mimeType && mimeType[1]) {
        if (type.includes(mimeType[1]) && length < 5) {
          this.imagesArray?.push(imgUrl);
          if (this.imagesArray?.length == 5) {
            this.isRender = false;
            var drag = document.getElementById('drag');
            drag?.classList.add('disabled-image');
            this.allowDropImages = false;
          }
          const temp = document.createElement('img') as HTMLImageElement;
          temp.src = imgUrl as string;
          check?.classList.add('active');
          addSvg?.setAttribute('style', 'display : none');
        } else {
          this.toastr.error(
            'Định dạng file không hợp lệ. Chỉ chấp nhận định dạng ảnh!',
            'Lỗi upload ảnh'
          );
        }
      }
    };

    if (event.target.files && event.target.files.length > 0) {
      reader.readAsDataURL(event.target.files[0]);
      this.imagesData?.push(event.target.files[0]);
    }
  }
  imageLoaded(){
    this.loading = false;
  }
  closeFunction() {}
  handleClose() {
    this.isDelete = false;
    this.isAdd = false;
  }
  updateStatus(){

  }
  deleteImage(index: number) {
    if (this.isEdit) {
      this.imagesArray?.splice(index, 1);
      this.imagesEdit?.splice(index, 1);
      alert(index);
      this.isRender = true;
      this.allowDropImages = true;
      console.log(this.wineUpdate?.img1);
      if (this.wineUpdate?.img4 != null && index == 4) {
        this.wineUpdate.img4 = null;
        return;
      }
      if (this.wineUpdate?.img3 != null && index == 3) {
        this.wineUpdate.img3 = null;
        return;
        
      }
      if (this.wineUpdate?.img2 != null && index == 2) {
        this.wineUpdate.img2 = null;
        return;
        
      }
      if (this.wineUpdate?.img1 != null && index == 1) {
        this.wineUpdate.img1 = null;
        alert(1);
        return;
      }
      if (this.wineUpdate?.img != null && index == 0) {
        this.wineUpdate.img = null;
        return;
        
      }
    } 
    else {
      this.imagesArray?.splice(index, 1);
      if (this.imagesArray?.length === 5) {
        this.isRender = false;
        this.allowDropImages = false;
      } else {
        this.isRender = true;
        this.allowDropImages = true;
      }
    }
  }
  handleSend(code: any, name: any, date:any, unit: any, codeGinseng: any, effect: any, more_info: any){
    alert(code.value + " " + name.value + " " + date.value + " " + unit.value + " "  + effect.value + " " + more_info.value);
  }
  handleUnit(){
    if(this.isML){
      let newVariable = this.unitValue / 10;
      if(typeof newVariable === "number"){
        this.display = newVariable + " cc";
      }
      else{
        this.display = '';
        this.toastr.warning("Bạn vui lòng nhập đơn vị là số","CẢNH BÁO");
      }

    }
    else{
      let newVariable = this.unitValue * 10;
      if(typeof newVariable === "number"){
        this.display = newVariable + " ml";
      }
      else{
        this.display = '';
        alert(1);
        this.toastr.warning("Bạn vui lòng nhập đơn vị là số","CẢNH BÁO");
      }
    }
  }
  handleClick(event: any){
    console.log(event.target.checked);
    if(event.target.checked === true){
      this.isML = true;
    }
    else {
      this.isML = false;
    }
    this.handleUnit();
  }
}
