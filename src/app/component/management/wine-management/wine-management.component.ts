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
import { QRCodeErrorCorrectionLevel } from "qrcode";
import { QRCode } from 'qrcode';
import { saveAs } from 'file-saver';
import * as qrcode from 'qrcode-generator';


@Component({
  selector: 'app-wine-management',
  templateUrl: './wine-management.component.html',
  styleUrls: ['./wine-management.component.scss'],
  providers: [DatePipe],
})
export class WineManagementComponent implements OnInit {
  @ViewChild('qrcode') qrcode!: ElementRef;
  wine: Wine[] | null = null;
  wineUpdate: Wine | null = null;
  angularxQrCode: any;
  imagesArray: any[] | null = null;
  imagesData: any[] | null = null;
  imagesEdit: any[] | null = null;
  allowDropImages = true;

  loading = true;
  showCalendar = false;
  isRender = true;
  isDelete = false;
  isDisable = true;
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
  init = false;
  size = 0;
  item1: any;
  item2: any;
  item3: any;
  currentPage = 1;
  unitValue: number = 0;
  newValue: number = 0;
  codeWine: any;
  titleForm = '';
  footerForm = '';
  inputForm!: FormGroup;
  https: any;
  isML = true;
  display = ' ';
  isQR = false  ;
qrCodeData: any;
ngAfterViewInit() {
  console.log('this.qrcode:', this.qrcode);
  if (this.qrcode) {
    console.log('this.qrcode.nativeElement:', this.qrcode.nativeElement);
  }
}
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
    this.setUp();
    this.isRender = true;
    this.checkValid();
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
        this.display = this.newValue + ' cc';
        this.pagination.init(this.size, this.numberOfItems);
        this.http
          .get('http://localhost:5050/admin/ginseng/get/code')
          .subscribe((data: any) => {
            this.ArrayGinseng = data;
          });
        this.loading = false;
        this.setUp();
      });
      this.angularxQrCode = 'Your QR code data string';
  }
  ngOnInit() {
    this.inputForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      unit: new FormControl('', [Validators.required]),
      effect: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
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
  update() {
    this.loading = true;
    this.init = true; 
    let nameInput = document.getElementById('nameInput') as HTMLInputElement;
    let codeInput = document.getElementById('codeInput') as HTMLInputElement;
    let date = document.getElementById('date') as HTMLInputElement;
    let inputCodeGinseng = document.getElementById(
      'inputCodeGinseng'
    ) as HTMLInputElement;
    let switcher = document.getElementById('switcher') as HTMLInputElement;
    let effectInput = document.getElementById(
      'effectInput'
    ) as HTMLInputElement;
    let more_info = document.getElementById('more_info') as HTMLInputElement;
    if (this.wineUpdate)
      if (
        codeInput &&
        nameInput &&
        date &&
        inputCodeGinseng &&
        effectInput &&
        more_info &&
        switcher
      ) {
        codeInput.setAttribute('disabled', 'disabled');
        this.inputForm.get('code')?.setValue(this.wineUpdate?.codewine as string);
        more_info.value = this.wineUpdate?.moreinfo as string;
        this.inputForm.get('name')?.setValue(this.wineUpdate?.namewine as string);
        this.inputForm.get('effect')?.setValue(this.wineUpdate?.effect as string);
        inputCodeGinseng.value = this.wineUpdate?.ginseng.code as string;
        if (this.wineUpdate?.volumewine.includes('ml')) {
          this.isML = true;

          this.unitValue = this.wineUpdate?.cc;
          this.handleUnit();
        }
        if (this.wineUpdate?.volumewine.includes('cc')) {
          switcher.checked = false;
          this.unitValue = this.wineUpdate?.cc;
          this.handleUnit();
        }
        if (this.wineUpdate?.created_date)
        this.inputForm.get('date')?.setValue(this.formatDate(this.wineUpdate?.created_date));
      }
    if (this.wineUpdate?.image) {
      this.imagesEdit?.push(this.wineUpdate?.image);
    }
    if (this.wineUpdate?.image1) {
      this.imagesEdit?.push(this.wineUpdate?.image1);
    }
    if (this.wineUpdate?.image2) {
      this.imagesEdit?.push(this.wineUpdate?.image2);
    }
    if (this.wineUpdate?.image3) {
      this.imagesEdit?.push(this.wineUpdate?.image3);
    }
    if (this.wineUpdate?.image4) {
      this.imagesEdit?.push(this.wineUpdate?.image4);
    }
    // this.inputForm.get('image')?.disable();
    this.HandleEditImage();
    this.handleUnit();
    this.checkValid();
  }

  async HandleEditImage() {
    if (this.imagesEdit) {
      for (let i of this.imagesEdit) {
        await fetch(i)
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Network response was not ok: ${res.status}`);
            }
            return res.blob();
          })
          .then((blob) => {
            let reader = new FileReader();
            reader.onload = (e) => {
              let base64dataa = reader.result;
              this.imagesArray?.push(base64dataa);
            };
            reader.readAsDataURL(blob);
          })
          .catch((error) => {
            alert(error);
          });
      }
    } else {
      alert(1);
    }
  }
  handleUpdate(id: any) {
    this.codeWine = id;
    this.titleForm = 'Cập nhật sản phẩm';
    this.footerForm = 'Sửa';
    this.isEdit = true;
    this.isAdd = true;
    if (this.codeWine) {
      this.wineService.getProduct(this.codeWine).subscribe((data: any) => {
        console.log(data);
        this.wineUpdate = data;
        if (this.wineUpdate) {
          this.update();
        }
      });
    }
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
  handleChoseGinsengCode(event: any) {
    let value = event.target.value;
    let input = document.getElementById('inputCodeGinseng') as HTMLInputElement;
    if (input) {
      input.value = value;
    }
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
    this.inputForm.get('date')?.setValue(this.formatDate(date));
  }
  uploadImage() {
    var button = document.getElementById('button');
    if (!button) {
      alert(1);
    }
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
  handleDragEnter(event: any) {}
  allowDrop(event: any) {}
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
    this.checkValid();
  }
  imageLoaded() {
    this.loading = false;
    this.inputForm.updateValueAndValidity();
    this.checkValid();
  }

  handleClose() {
    this.isDelete = false;
    this.isAdd = false;
  }
  updateStatus() {}

  deleteImage(index: number) {
    if (this.isEdit) {
      this.imagesArray?.splice(index, 1);
      if (this.imagesArray?.length == 0) {
        this.isDisable = true;
      }
      this.imagesEdit?.splice(index, 1);
      alert(index);
      this.isRender = true;
      this.allowDropImages = true;
      if (this.wineUpdate?.image4 != null && index == 4) {
        this.wineUpdate.image4 = null;
        return;
      }
      if (this.wineUpdate?.image3 != null && index == 3) {
        this.wineUpdate.image3 = null;
        return;
      }
      if (this.wineUpdate?.image2 != null && index == 2) {
        this.wineUpdate.image2 = null;
        return;
      }
      if (this.wineUpdate?.image1 != null && index == 1) {
        this.wineUpdate.image1 = null;
        alert(1);
        return;
      }
      if (this.wineUpdate?.image != null && index == 0) {
        this.wineUpdate.image = null;
        return;
      }
    } else {
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
  async reset() {
    this.setUp();
  }
  handleSend(
    code: any,
    name: any,
    date: any,
    unit: any,
    codeGinseng: any,
    effectInput: any,
    more_info: any,
  ) {
    const ginsengObj = {
      code: codeGinseng.value,
    };
    let codewine = code.value;
    let namewine = name.value;
    let volumewine = '';
    let cc;
    if (this.isML) {
      volumewine = unit.value + ' ml';
      cc = unit.value;
    } else {
      volumewine = unit.value + ' cc';
      cc = unit.value;
    }
    let dateInputValue = date.value;
    if (typeof dateInputValue !== 'string') {
      dateInputValue = dateInputValue.toString();
    }
    const parts = dateInputValue.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const isValidDate =
      day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1000 && year <= 9999;
    if (!isValidDate || parts.length < 2) {
      this.toastr.warning(
        'Định dạng hợp lệ là dd/mm/yyyy', 'Định dạng ngày tháng không hợp lệ.'
      );
      return;
    }
    let created_date = new Date(year, month, day);
    

    let moreinfo = more_info.value;
    let effect = effectInput.value;
    let ginseng = ginsengObj;
    let image : any | null = null;
    let image1 : any | null = null;
    let image2 : any | null = null;
    let image3 : any | null = null;
    let image4 : any | null = null;
    if(this.imagesEdit){
        for(let i = 0; i < this.imagesEdit.length; i++){
          switch(i){
            case 0:
              if(this.imagesEdit[i] == null) {
                image = null;
                break;
              }
              else  image = this.imagesEdit[i];
              break;
            case 1:
              if(this.imagesEdit[i] == null) {
                image1 = null;
                break;
              }
              else  image1 = this.imagesEdit[i];
              break;
            case 2:
                if(this.imagesEdit[i] == null) {
                  image2 = null;
                  break;
                }
                else  image2 = this.imagesEdit[i];
                break; 
              case 3:
                if(this.imagesEdit[i] == null) {
                  image3 = null;
                  break;
                }
                else  image3 = this.imagesEdit[i];
                break; 
              case 4:
                if(this.imagesEdit[i] == null) {
                  image4 = null;
                  break;
                }
                else  image4 = this.imagesEdit[i];
                break; 
          }
        }
        
      }
    let obj = {
      codewine,
      namewine,
      volumewine,
      cc,
      created_date,
      effect,
      moreinfo,
      image,
      image1,
      image2,
      image3,
      image4,
      ginseng,
    };
    console.log(obj);
    if(!this.isEdit){
      if (this.imagesData != null) {
        this.wineService
          .addProduct(obj, this.imagesData)
          .subscribe((data: any) => {
            this.toastr.success(
              'Chúc mừng, bạn đã thêm sản phẩm thành công!',
              'Đã thêm sản phẩm thành công'
            );
            // this.loading = false;
            this.closeFunction();
            this.setUp();
          });
      }
      return;
    }
    else{
      if(this.imagesData){
        this.wineService.editWine(obj, this.imagesData).subscribe((data: any)=>{
          this.toastr.success(
            'Chúc mừng, bạn đã cập nhật sản phẩm thành công!',
            'Đã cập nhật sản phẩm thành công'
          );
          this.handleClose();
          this.setUp();
        },
        (error) => {
          if(error = 'The product is not present'){
            this.toastr.error(
              'Không thể thay đổi mã sâm. Vui lòng tạo sản phẩm mới với mã sâm mới!',
              'Lỗi cập nhật sản phẩm'
            );
          }
          this.toastr.error(
            'Đã có lỗi trong quá trình xử lý dữ liệu của bạn. Vui lòng kiểm tra và thử lại với bức ảnh đúng định dạng hoặc giấy chứng nhận đúng định dạng!',
            'Lỗi cập nhật sản phẩm'
          );
        });
      }
      else if(this.imagesData==null){
        this.wineService.editWine(obj,null).subscribe((data: any)=>{
          this.toastr.success(
            'Chúc mừng, bạn đã cập nhật sản phẩm thành công!',
            'Đã cập nhật sản phẩm thành công'
          );
          this.handleClose();
          this.setUp();
        },
        (error) => {
          this.toastr.error(
            'Đã có lỗi trong quá trình xử lý dữ liệu của bạn. Vui lòng kiểm tra và thử lại sau',
            'Lỗi cập nhật sản phẩm'
          );
        });

      }
    }
  }
  handleUnit() {
    let checkNum =  this.unitValue * 1;
    console.log(typeof this.unitValue);
    if (typeof checkNum === 'number') {
      this.inputForm.get('unit')?.setValue(this.unitValue);
      if (this.isML) {
        let newVariable = this.unitValue / 10;
        
        this.display = newVariable + ' cc';
      }
         else {
          let newVariable = this.unitValue * 10;
          this.display = newVariable + ' ml';
        }
      
    }
    if(isNaN(checkNum)){
      this.display = '';
      this.toastr.warning('Bạn vui lòng nhập đơn vị là số', 'CẢNH BÁO');
    }
    this.checkValid();
  }
  handleClick(event: any) {
    console.log(event.target.checked);
    if (event.target.checked === true) {
      this.isML = true;
    } else {
      this.isML = false;
    }
    this.handleUnit();
  }
  closeFunction() {
    this.inputForm.reset();
    this.imagesData = [];
    this.imagesArray = [];
    this.imagesEdit = [];
    this.isAdd = false;
    this.isEdit = false;
    this.isRender = true;
    this.setUp();
  }
  checkValid() {
    if (!this.isEdit) {
      this.isDisable = !this.inputForm.valid;
      if (this.imagesArray == null) {
        this.isDisable = true;
        return;
      }
    } 
    else {
      if(this.imagesEdit != null && this.inputForm.get('name')?.value  && this.inputForm.get('date')?.value  && this.inputForm.get('unit')?.value  && this.inputForm.get('effect')?.value ){
        this.isDisable = false;
      }
      else{
          this.isDisable = true;
      }
    }
  }
  handleVisibility(){
    this.init= !this.init;
  }
  handleExit(){
    this.isQR = false;
  }
  handleCreateQR(code: any){
    this.wineService.getProduct(code.value).subscribe((data: any) =>{
      if(data == null){
        this.toastr.success("Đã tạo thành công mã QR. Bạn có thể tải về để tạo và lưu sản phẩm");
        this.angularxQrCode = code.value;
        console.log('angularxQrCode:', this.angularxQrCode);
        this.isQR = true;
      }
      if(data){
        this.toastr.error("Mã sản phẩm đã tồn tại. Bạn vui lòng nhập mã khác");
      } 
    },
    (error: any) => {

    })
    
    this.isQR = true;
  }
  downloadQRCode() {
    // const canvas: HTMLCanvasElement = this.qrcode.nativeElement.lastChild;
    // const imageDataURL = canvas.toDataURL('image/png');

    // const a = document.createElement('a');
    // a.href = imageDataURL;
    // a.download = 'qrcode.png';
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    const canvas: HTMLCanvasElement = this.qrcode.nativeElement.lastChild;
    canvas.toBlob((blob) => {
      if(blob)
      saveAs(blob, 'qrcode.png');
    });
    let button = document.getElementById('btnAdd');
    console.log(button);
    if(button){
      button.click();
    }
    this.isQR= false;
  }
}


