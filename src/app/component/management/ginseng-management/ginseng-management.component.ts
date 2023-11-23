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

@Component({
  selector: 'app-ginseng-management',
  templateUrl: './ginseng-management.component.html',
  styleUrls: [
    './ginseng-management.component.scss',
    '../../../app.component.scss',
  ],
  providers: [DatePipe],
  // encapsulation: ViewEncapsulation.None
})
export class GinsengManagementComponent implements OnInit {
  ginseng: Ginseng[] | null = null;
  ginsengUpdate: Ginseng | null = null;
  titleForm: string | null = null;
  footerForm: string | null = null;
  showCalendar = false;
  idGinseng: number | null = null;
  loading = false;
  allowDropImages = true;
  img: HTMLImageElement | null = null;
  imagesData: any[] | null = null;
  selected: Date | null = null;
  imagesEdit: any[] | null = null;
  editCertificate: any | null = null;
  amount = '';
  numberOfItems = 10;
  inputFile: any;
  certificate: any | null = null;
  temp: File | null = null;
  isRender = true;
  temp1: any;
  name_certi: String | null = 'Tải giấy chứng nhận';
  currentPage = 1;
  size = 0;
  page = 0;
  item1: any;
  item2: any;
  isDelete = false;
  imagesArray: any[] | null = null;
  item3: any;
  isSorted = false;
  isNext = false;
  isPrev = false;
  isAdd = false;
  isEdit = false;
  isDisabled = true;
  init = false;
  addForm!: FormGroup;
  @ViewChild('pdfViewer') pdfViewer: ElementRef | undefined;
  pdfSrc: string | ArrayBuffer | Uint8Array | undefined;
  constructor(
    
    @Inject(GinsengService) private ginsengService: GinsengService,
    private pagination: PaginationService,
    private router: Router,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) {
    this.imagesArray = [];
    this.imagesData = [];
    this.loading = false;
    this.imagesEdit = [];
    
    this.ginsengService.getListGinseng(this.numberOfItems, 0).subscribe(
      (data: any) => {
        this.ginseng = data.ginsengs;
        this.amount = data.amount + ' Loại sâm';
        this.size = data.amount;
        this.pagination.init(this.size, this.numberOfItems);
        this.setUp();
      },
      (error) => {
        this.router.navigate(['login']);
      }
    );
    
  }
  ngOnInit() {
    
    if (!this.isEdit) {
      this.addForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        code: new FormControl('', [Validators.required]),
        effect: new FormControl('', [Validators.required]),
        date: new FormControl('', [Validators.required]),
        source: new FormControl('', [Validators.required]),
        certificate: new FormControl('', [Validators.required]),
        image: new FormControl('', [Validators.required]),
      });
    }
    this.pdfSrc = 'URL/file.pdf';
    this.check();
    this.setUp();
  }
  openPdf() {}
  HandleDelte(id: any) {
    this.idGinseng = id;
    if (this.isDelete) {
      this.ginsengService.deleteGinseng(id).subscribe((res) => {
        if (res == 'DELETED') {
          this.toastr.success('Sản phẩm đã xóa thành công');
          this.setUp();
          this.handleClose();
        }
      });
    }
    this.isDelete = true;
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
  GetList(page: number, number: any) {
    page--;
    this.ginsengService.getListGinseng(number, page).subscribe(
      (data: any) => {
        this.ginseng = data.ginsengs;
        this.amount = data.amount + ' Loại sâm';
        this.size = data.amount;
      },
      (error) => {
        this.router.navigate(['']);
      }
    );
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
    this.addForm.reset();
    this.GetList(this.currentPage, this.numberOfItems);
    this.isAdd = false;
  }

  HandleSort() {
    if (this.isSorted) {
      this.ginseng?.sort((a, b) =>
        a.code.toString().localeCompare(b.code.toString())
      );
      this.isSorted = false;
    } else {
      this.ginseng?.sort((a, b) =>
        a.name.toString().localeCompare(b.name.toString())
      );
      this.isSorted = true;
    }
  }
  HandleAddGinseng() {
    this.titleForm = 'Tạo sâm mới';
    this.footerForm = 'Thêm';
    this.name_certi = 'Tải giấy chứng nhận lên';
    this.setUp();
    this.isRender = true;
    this.check();
    this.isAdd = true;
  }
  uploadImage() {
    var button = document.getElementById('button');
    button?.click();
  }
  uploadCerti() {
    var button = document.getElementById('certi');
    button?.click();
  }
  handleUploadPdf(event: any) {
    const certi = document.getElementById('certi');
    var type = 'application/pdf';
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileUrl = reader.result;
      var base64String = e.target?.result;
      var mimeType = (base64String as string).match(
        /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/
      );
      if (mimeType && mimeType[1]) {
        if (type.includes(mimeType[1])) {
          this.temp1 = fileUrl;
          var drag = document.getElementById('certi') as HTMLInputElement;
          this.name_certi = this.getFileNameFromPath(drag.value as string);
          let open = document.getElementById('display');
          if (open) {
            open.addEventListener('click', this.showCertificate);
          }
        }
      }
    };
    if (event.target.files && event.target.files.length > 0) {
      reader.readAsDataURL(event.target.files[0]);
      this.certificate = event.target.files[0];
    }
    this.check();
  }
  showCertificate() {
    let show = document.getElementById('file-link');
    show?.click();
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
      this.temp1 = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      this.imagesData?.push(event.target.files[0]);
    }
    this.check();
  }
  deleteImage(index: number) {
    if (this.isEdit) {
      this.imagesArray?.splice(index, 1);
      this.imagesEdit?.splice(index, 1);
      this.isRender = true;
      this.allowDropImages = true;
      console.log(this.ginsengUpdate?.img1);
      if (this.ginsengUpdate?.img4 != null && index == 4) {
        this.ginsengUpdate.img4 = null;
        return;
      }
      if (this.ginsengUpdate?.img3 != null && index == 3) {
        this.ginsengUpdate.img3 = null;
        return;
        
      }
      if (this.ginsengUpdate?.img2 != null && index == 2) {
        this.ginsengUpdate.img2 = null;
        return;
        
      }
      if (this.ginsengUpdate?.img1 != null && index == 1) {
        this.ginsengUpdate.img1 = null;
        return;
      }
      if (this.ginsengUpdate?.img != null && index == 0) {
        this.ginsengUpdate.img = null;
        if(this.imagesArray?.length == 0){
          this.isDisabled = true;
        }
        return;
        
      }
      if(this.imagesArray?.length == 0){
        this.isDisabled = true;
      }
    } 
    else {
      this.imagesArray?.splice(index, 1);
      if(this.imagesArray?.length == 0){
        this.isDisabled = true;
      }
      if (this.imagesArray?.length === 5) {
        this.isRender = false;
        this.allowDropImages = false;
         
      } else {
        this.isRender = true;
        this.allowDropImages = true;
          
      }
      // this.check();
    }
   
  }
  formatDate(date: Date | null): any {
    return date ? this.datePipe.transform(date, 'dd/MM/yyyy') : '';
  }
  onDateSelected(date: Date) {
    this.selected = date;
    this.showCalendar = false;
    let temp = document.getElementById('date') as HTMLInputElement;
    this.addForm.get('date')?.setValue(this.formatDate(date));
    temp.value = this.formatDate(date);
  }
  handleClose() {
    
    this.showCalendar = false;
    this.imagesArray?.splice(0, this.imagesArray.length);
    this.selected = null;
    this.isDelete = false;
    if (this.isEdit) {
      this.idGinseng = null;
      this.imagesEdit?.splice(0, this.imagesEdit.length);
      this.isEdit = false;
      let code = document.getElementById('codeInput') as HTMLInputElement;
      let name = document.getElementById('nameInput') as HTMLInputElement;
      let date = document.getElementById('date') as HTMLInputElement;
      let resource = document.getElementById('resourceInput') as HTMLInputElement;
      let effect = document.getElementById('effectInput') as HTMLInputElement;
      let more_info = document.getElementById('more_info') as HTMLInputElement;
      console.log(effect);
      if(code || name || date || resource || effect || more_info ){
        code.value = '';
        let form = document.getElementById('inputForm') as HTMLInputElement;
        if(form){
          form.value = '';
        }
        name.value = '';
        date.value = '';
        resource.value = '';
        effect.value = '';
        more_info.value = '';
        this.name_certi = 'Tải giấy chứng nhận lên'
      }
    this.addForm.get('image')?.enable();
    this.addForm.get('certificate')?.enable();
    }
    this.addForm.reset();
    this.setUp();
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
  allowDrop(event: DragEvent) {
    event.preventDefault();
  }
  handleDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.add('drag-over');
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
  async handleAddGinseng(
    codeInput: any,
    nameInput: any,
    dateInput: any,
    sourceInput: any,
    effectInput: any,
    moreInput: any
  ) {
    let code = codeInput.value;
    let name = nameInput.value;
    let source = sourceInput.value;
    let effect = effectInput.value;
    let dateInputValue = dateInput.value;
    if (typeof dateInputValue !== 'string') {
      dateInputValue = dateInputValue.toString();
    }
    const parts = dateInputValue.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    let more_info = '';
    let created_date = new Date(year, month, day);
    if (moreInput != null) {
      more_info = moreInput.value;
    }
    if (!this.isEdit) {
      let obj = { code, created_date, name, source, effect, more_info };
      this.loading = true;
      if (this.imagesData != null) {
        this.ginsengService
          .addGinseng(obj, this.imagesData, this.certificate)
          .subscribe(
            (data: any) => {
              this.toastr.success(
                'Chúc mừng, bạn đã thêm sản phẩm thành công!',
                'Đã thêm sản phẩm thành công'
              );
              this.loading = false;
              this.handleClose();              
              this.setUp();
              
            },
            (error) => {
              this.toastr.error(
                'Đã có lỗi trong quá trình xử lý dữ liệu của bạn. Vui lòng kiểm tra và thử lại sau',
                'Lỗi thêm sản phẩm'
              );
            }
          );
      }
    } 
    else {
      let img : any | null = null;
      let img1 : any | null = null;
      let img2 : any | null = null;
      let img3 : any | null = null;
      let img4 : any | null = null;
      if(this.imagesEdit){
        for(let i = 0; i < this.imagesEdit.length; i++){
            switch(i){
              case 0:
                if(this.imagesEdit[i] == null) {
                  img = null;
                  break;
                }
                else  img = this.imagesEdit[i];
                break;
              case 1:
                if(this.imagesEdit[i] == null) {
                  img1 = null;
                  break;
                }
                else  img1 = this.imagesEdit[i];
                break;
              case 2:
                  if(this.imagesEdit[i] == null) {
                    img2 = null;
                    break;
                  }
                  else  img2 = this.imagesEdit[i];
                  break; 
                case 3:
                  if(this.imagesEdit[i] == null) {
                    img3 = null;
                    break;
                  }
                  else  img3 = this.imagesEdit[i];
                  break; 
                case 4:
                  if(this.imagesEdit[i] == null) {
                    img4 = null;
                    break;
                  }
                  else  img4 = this.imagesEdit[i];
                  break; 
            }
        }
      }
      let obj = { code, created_date, name, source, effect, more_info, img, img1, img2, img3, img4 };
      if (this.imagesData  && this.certificate) {
        this.ginsengService
          .editGinseng(obj, this.imagesData, this.certificate)
          .subscribe(
            (data: any) => {
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
            }
          );
      }
      else if(this.imagesData != null && this.certificate == null){
        this.ginsengService
          .editGinseng(obj, this.imagesData, null)
          .subscribe(
            (data: any) => {
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
                'Lỗi thêm sản phẩm'
              );
            }
          );
      }
      else if(this.certificate != null && this.imagesData == null){
        this.ginsengService
          .editGinseng(obj, null, this.certificate)
          .subscribe(
            (data: any) => {
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
                'Lỗi thêm sản phẩm'
              );
            }
          );
      }
      else {
        this.ginsengService
        .editGinseng(obj, null, null)
        .subscribe(
          (data: any) => {
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
              'Lỗi cập nhật sâm'
            );
          }
        );
      }
    }
  }
  handleUpdate(id: any) {
    this.idGinseng = id;
    this.isAdd = true;
    this.titleForm = 'Cập nhật sâm';
    this.footerForm = 'Sửa';
    this.isEdit = true;
    // this.loading =  true
    if (this.idGinseng)
      this.ginsengService.getGinseng(this.idGinseng).subscribe((data: any) => {
        this.ginsengUpdate = data;
        if (this.ginsengUpdate) {
          this.update();
        }
      });
  }
  update() {
    this.loading = true;
    this.init = true;
    let code = document.querySelector('#codeInput') as HTMLInputElement;
    let date = document.querySelector('#date') as HTMLInputElement;
    let more_info = document.getElementById('more_info') as HTMLInputElement;
    console.log(this.ginsengUpdate);
    if (date && more_info) {
      code.setAttribute('disabled', 'disabled');
      this.addForm.get('code')?.setValue(this.ginsengUpdate?.code as string);
      this.addForm.get('more_info')?.setValue(this.ginsengUpdate?.more_info as string);
      this.addForm.get('name')?.setValue(this.ginsengUpdate?.name as string);
      this.addForm.get('effect')?.setValue(this.ginsengUpdate?.effect as string);
      this.addForm.get('source')?.setValue(this.ginsengUpdate?.source as string);
      if(this.ginsengUpdate?.created_date)
      this.addForm.get('date')?.setValue(this.formatDate(this.ginsengUpdate?.created_date));
      more_info.value = this.ginsengUpdate?.more_info as string;
      let file = this.ginsengUpdate?.certificate;
      if (file != null) {
        file = this.getFileNameFromPath(file);
        this.name_certi = file;
      }
      this.editCertificate = this.ginsengUpdate?.certificate;
      if (this.ginsengUpdate?.created_date)
        date.value = this.formatDate(this.ginsengUpdate?.created_date);
    }
    if (this.ginsengUpdate?.img) {
      this.imagesEdit?.push(this.ginsengUpdate?.img);
    }
    if (this.ginsengUpdate?.img1) {
      this.imagesEdit?.push(this.ginsengUpdate?.img1);
    }
    if (this.ginsengUpdate?.img2) {
      this.imagesEdit?.push(this.ginsengUpdate?.img2);
    }
    if (this.ginsengUpdate?.img3) {
      this.imagesEdit?.push(this.ginsengUpdate?.img3);
    }
    if (this.ginsengUpdate?.img4) {
      this.imagesEdit?.push(this.ginsengUpdate?.img4);
    }

    console.log(this.imagesEdit);
    if (this.isEdit && this.imagesEdit!=null) {
      this.HandleEditImage();
      this.HandleEditCertificate();
      this.loading = false;
      this.toastr.warning("Vui lòng không để trống hình ảnh");
    }
    
  }
  imageLoaded(){
    this.loading = false;
    this.addForm.updateValueAndValidity();
    this.addForm.get('image')?.enable();
    this.check();
  }
  async HandleEditImage() {
    if(this.imagesEdit) {
      for(let i of this.imagesEdit) {
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
          .catch((error) => {});
      };
    }
  }

  HandleEditCertificate() {
    fetch(this.editCertificate)
      .then((res) => res.blob())
      .then((blob) => {
        let reader = new FileReader();
        reader.onloadend = () => {
          let base64dataarr = reader.result;
        };
        reader.readAsDataURL(blob);
        this.editCertificate = blob.type;
      });
  }
  updateStatus(){
    
    this.addForm.get('name')?.updateValueAndValidity();
  }
  closeFunction(){
    this.handleClose();
    this.setUp();

  }
  check(){
    if(!this.isEdit ){
      this.isDisabled = !this.addForm.valid;
      if(this.imagesArray == null){
        this.isDisabled = true;
        return;
        alert(1);
      }
    }
    else{
      if(this.imagesEdit != null && this.addForm.get('name')?.value  && this.addForm.get('date')?.value  && this.addForm.get('source')?.value  && this.addForm.get('effect')?.value ){
        this.isDisabled = false;
      }
      else{
          this.isDisabled = true;
      }
    }
  }

}
