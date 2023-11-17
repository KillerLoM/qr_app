import { Component, Renderer2, ElementRef, OnInit, Inject, ViewEncapsulation, ViewChild  } from '@angular/core';
import { GetGinsengsService } from 'src/app/services/api-service/ginseng-service/get-ginsengs.service';
import { Ginseng } from '../../../model/ginseng';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { PaginationService } from 'src/app/services/app-service/pagination.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import { ToastrService } from 'ngx-toastr';
import { AddGinsengService } from 'src/app/services/api-service/ginseng-service/add-ginseng.service';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-ginseng-management',
  templateUrl: './ginseng-management.component.html',
  styleUrls: ['./ginseng-management.component.scss', '../../../app.component.scss'],
  providers: [DatePipe],
  // encapsulation: ViewEncapsulation.None
})
export class GinsengManagementComponent implements OnInit  {
  ginseng: Ginseng[] | null = null;
  showCalendar = false;
  allowDropImages = true; 
  img: HTMLImageElement | null = null;
  temp12: any[]| null = null;
  selected: Date | null = null;
  amount = '';
  numberOfItems = 10;
  inputFile: any;
  certificate: any;
  temp: File| null = null;
  isRender = true;
  temp1: any;
  name_certi : String | null = 'Tải giấy chứng nhận';
  currentPage = 1;
  size = 0;
  page = 0;
  next = true;
  item1: any;
  item2: any;
  imagesArray : any[] | null = null;
  item3: any;
  isSorted = false;
  check = document.getElementsByClassName('active-atom');
  isNext = false;
  isPrev = false;
  isAdd = false;
  addForm!: FormGroup;
  @ViewChild('pdfViewer') pdfViewer: ElementRef | undefined;
  pdfSrc: string | ArrayBuffer | Uint8Array | undefined;
  constructor(
    @Inject(GetGinsengsService) private getListGinseng: GetGinsengsService,
    private pagination: PaginationService,
    private router: Router,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    @Inject(AddGinsengService) private addService: AddGinsengService, 
  ) {
    this.getListGinseng.getListGinseng(this.numberOfItems, 0).subscribe(
      (data: any) => {
        this.ginseng = data.ginsengs;
        this.imagesArray = [];
        this.temp12 = []
        this.amount = data.amount + ' Loại sâm';
        this.size = data.amount;
        this.pagination.init(this.size, this.numberOfItems);
        this.setUp();
      },
      (error) => {
        console.log(error.error);
        this.router.navigate(['']);
      }
    );
  }
  ngOnInit() {
    this.addForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
      ]),
      code: new FormControl('', [
        Validators.required,
      ]),
      effect: new FormControl('', [
        Validators.required,
      ]),
      source: new FormControl('', [
        Validators.required,
      ]),
    });
    // Đặt đường dẫn của file PDF đã lưu
    // Ví dụ: lấy từ server hoặc nơi bạn lưu trữ file PDF
    this.pdfSrc = 'URL/file.pdf'; // Thay đổi URL/file.pdf bằng đường dẫn thực tế của bạn
  }
  openPdf() {
    // Mở file PDF khi người dùng ấn vào
    /*
    const pdfViewer = this.pdfViewer?.nativeElement;
    pdfViewer.src = 'data:application/pdf;base64,JVBERi0xLjQKJfbk/N8KMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovVmVyc2lvbiAvMS40Ci9QYWdlcyAyIDAgUgovU3RydWN0VHJlZVJvb3QgMyAwIFIKL01hcmtJbmZvIDQgMCBSCi9MYW5nICh2aS1WTikKL1ZpZXdlclByZWZlcmVuY2VzIDUgMCBSCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9DcmVhdG9yIChDYW52YSkKL1Byb2R1Y2VyIChDYW52YSkKL0NyZWF0aW9uRGF0ZSAoRDoyMDIzMTExNTE1MTkzNiswMCcwMCcpCi9Nb2REYXRlIChEOjIwMjMxMTE1MTUxOTM2KzAwJzAwJykKL0tleXdvcmRzIChEQUZsNEQ4LWdYRSxCQUZRMXhSb0dkZykKL0F1dGhvciA8RkVGRjAwNEUwMDY3MDA3NTAwNzkxRUM1MDA2RTAwMjAwMDREMDA2OTAwNkUwMDY4MDAyMDAwNTQwMEUyMDA2RD4KL1RpdGxlIChCbGFjayBXaGl0ZSBNaW5pbWFsaXN0IENWIFJlc3VtZSkKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFs3IDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1N0cnVjdFRyZWVSb290Ci9QYXJlbnRUcmVlIDggMCBSCi9QYXJlbnRUcmVlTmV4dEtleSAxCi9LIFs5IDAgUl0KL0lEVHJlZSAxMCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL01hcmtlZCB0cnVlCi9TdXNwZWN0cyBmYWxzZQo+PgplbmRvYmoKNSAwIG9iago8PAovRGlzcGxheURvY1RpdGxlIHRydWUKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1Jlc291cmNlcyA8PAovUHJvY1NldCBbL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSV0KL0V4dEdTdGF0ZSAxMSAwIFIKL1BhdHRlcm4gMTIgMCBSCi9YT2JqZWN0IDw8Ci9YMTMgMTMgMCBSCj4+Ci9Gb250IDE0IDAgUgo+PgovTWVkaWFCb3ggWzAuMCA3LjgyOTk4MTMgNTk1LjUgODUwLjA3OTk2XQovQ29udGVudHMgMTUgMCBSCi9TdHJ1Y3RQYXJlbnRzIDAKL1BhcmVudCAyIDAgUgovVGFicyAvUwovQmxlZWRCb3ggWzAuMCA3LjgyOTk4MTMgNTk1LjUgODUwLjA3OTk2XQovVHJpbUJveCBbMC4wIDcuODI5OTgxMyA1OTUuNSA4NTAuMDc5OTZdCi9Dcm9wQm94IFswLjAgNy44Mjk5ODEzIDU5NS41IDg1MC4wNzk5Nl0KL1JvdGF0ZSAwCi9Bbm5vdHMgW10KPj4KZW5kb2JqCjggMCBvYmoKPDwKL0xpbWl0cyBbMCAwXQovTnVtcyBbMCBbMTYgMCBSIDE2IDAgUiAxNiAwIFIgMTcgMCBSIDE3IDAgUiAxNyAwIFIgMTcgMCBSIDE3IDAgUiAxNyAwIFIgMTcgMCBSCjE3IDAgUiAxNyAwIFIgMTcgMCBSIDE3IDAgUiAxOCAwIFIgMTggMCBSIDE5IDAgUiAyMCAwIFIgMjAgMCBSIDIxIDAgUgoyMSAwIFIgMjIgMCBSIDIyIDAgUiAyMiAwIFIgMjIgMCBSIDIyIDAgUiAyMyAwIFIgMjMgMCBSIDI0IDAgUiAyNCAwIFIKMjQgMCBSIDI1IDAgUiAyNSAwIFIgMjUgMCBSIDI1IDAgUiAyNiAwIFIgMjcgMCBSIDI3IDAgUiAyNyAwIFIgMjcgMCBSCjI3IDAgUiAyNyAwIFIgMjcgMCBSIDI4IDAgUiAyOSAwIFIgMzAgMCBSIDMxIDAgUiAzMSAwIFIgMzEgMCBSIDMxIDAgUgozMSAwIFIgMzIgMCBSIDMzIDAgUiAzMyAwIFIgMzMgMCBSIDMzIDAgUiAzNCAwIFIgMzUgMCBSIDM2IDAgUiAzNyAwIFIKMzggMCBSIDM4IDAgUiAzOCAwIFIgMzggMCBSIDM5IDAgUiAzOSAwIFIgMzkgMCBSIDQwIDAgUiA0MSAwIFIgNDIgMCBSCjQyIDAgUiA0MiAwIFIgNDIgMCBSIDQzIDAgUiA0MyAwIFIgNDMgMCBSIDQzIDAgUiA0MyAwIFIgNDQgMCBSIDQ0IDAgUgo0NSAwIFIgNDUgMCBSIDQ2IDAgUiA0NiAwIFIgNDYgMCBSIDQ3IDAgUiA0NyAwIFIgNDcgMCBSIDQ3IDAgUiA0OCAwIFIKNDggMCBSIDQ4IDAgUiA0OCAwIFIgNDggMCBSIDQ4IDAgUiA0OCAwIFIgNDkgMCBSIDQ5IDAgUiA1MCAwIFIgNTAgMCBSCjUxIDAgUiA1MSAwIFIgNTEgMCBSIDUxIDAgUiA1MiAwIFIgNTIgMCBSIDUzIDAgUiA1NCAwIFIgNTUgMCBSIDU1IDAgUgo1NSAwIFIgNTYgMCBSIDU3IDAgUiA1OCAwIFIgNTkgMCBSIDU5IDAgUiA1OSAwIFIgNjAgMCBSIDYxIDAgUiA2MiAwIFIKNjMgMCBSIDYzIDAgUiA2NCAwIFIgNjQgMCBSIDY0IDAgUl0KXQo+PgplbmRvYmoKOSAwIG9iago8PAovVHlwZSAvU3RydWN0RWxlbQovUyAvRG9jdW1lbnQKL0xhbmcgKGVuKQovUCAzIDAgUgovSyBbNjUgMCBSXQovSUQgKG5vZGUwMDAzNjM2MCkKPj4KZW5kb2JqCjEwIDAgb2JqCjw8Ci9OYW1lcyBbKG5vZGUwMDAzNjM2MCkgOSAwIFIgKG5vZGUwMDAzNjM2MSkgMzAgMCBSIChub2RlMDAwMzYzNjIpIDY1IDAgUiAobm9kZTAwMDM2MzYzKSA2NiAwIFIgKG5vZGUwMDAzNjM2NCkgNjcgMCBSCihub2RlMDAwMzYzNjUpIDY4IDAgUiAobm9kZTAwMDM2MzY2KSA2OSAwIFIgKG5vZGUwMDAzNjM2NykgNzAgMCBSIChub2RlMDAwMzYzNjgpIDcxIDAgUiAobm9kZTAwMDM2MzY5KSA3MiAwIFIKKG5vZGUwMDAzNjM5NykgNzMgMCBSIChub2RlMDAwMzYzOTgpIDc0IDAgUiAobm9kZTAwMDM2Mzk5KSA3NSAwIFIgKG5vZGUwMDAzNjQwMCkgNzYgMCBSIChub2RlMDAwMzY0MDEpIDE2IDAgUgoobm9kZTAwMDM2NDAyKSA3NyAwIFIgKG5vZGUwMDAzNjQwMykgNzggMCBSIChub2RlMDAwMzY0MDQpIDc5IDAgUiAobm9kZTAwMDM2NDA1KSA4MCAwIFIgKG5vZGUwMDAzNjQwNikgMTcgMCBSCihub2RlMDAwMzY0MDcpIDgxIDAgUiAobm9kZTAwMDM2NDA4KSA4MiAwIFIgKG5vZGUwMDAzNjQwOSkgODMgMCBSIChub2RlMDAwMzY0MTApIDE4IDAgUiAobm9kZTAwMDM2NDExKSA4NCAwIFIKKG5vZGUwMDAzNjQxMikgODUgMCBSIChub2RlMDAwMzY0MTMpIDg2IDAgUiAobm9kZTAwMDM2NDE0KSAxOSAwIFIgKG5vZGUwMDAzNjQxNSkgODcgMCBSIChub2RlMDAwMzY0MTYpIDg4IDAgUgoobm9kZTAwMDM2NDE3KSA4OSAwIFIgKG5vZGUwMDAzNjQxOCkgMjAgMCBSIChub2RlMDAwMzY0MTkpIDkwIDAgUiAobm9kZTAwMDM2NDIwKSA5MSAwIFIgKG5vZGUwMDAzNjQyMSkgOTIgMCBSCihub2RlMDAwMzY0MjIpIDIxIDAgUiAobm9kZTAwMDM2NDIzKSA5MyAwIFIgKG5vZGUwMDAzNjQyNCkgOTQgMCBSIChub2RlMDAwMzY0MjUpIDk1IDAgUiAobm9kZTAwMDM2NDI2KSAyMiAwIFIKKG5vZGUwMDAzNjQyNykgOTYgMCBSIChub2RlMDAwMzY0MjgpIDk3IDAgUiAobm9kZTAwMDM2NDI5KSA5OCAwIFIgKG5vZGUwMDAzNjQzMCkgOTkgMCBSIChub2RlMDAwMzY0MzEpIDIzIDAgUgoobm9kZTAwMDM2NDMyKSAxMDAgMCBSIChub2RlMDAwMzY0MzMpIDEwMSAwIFIgKG5vZGUwMDAzNjQzNCkgMTAyIDAgUiAobm9kZTAwMDM2NDM1KSAxMDMgMCBSIChub2RlMDAwMzY0MzYpIDI0IDAgUgoobm9kZTAwMDM2NDM3KSAxMDQgMCBSIChub2RlMDAwMzY0MzgpIDEwNSAwIFIgKG5vZGUwMDAzNjQzOSkgMTA2IDAgUiAobm9kZTAwMDM2NDQwKSAyNSAwIFIgKG5vZGUwMDAzNjQ0MSkgMTA3IDAgUgoobm9kZTAwMDM2NDQyKSAyNiAwIFIgKG5vZGUwMDAzNjQ0MykgMTA4IDAgUiAobm9kZTAwMDM2NDQ0KSAxMDkgMCBSIChub2RlMDAwMzY0NDUpIDExMCAwIFIgKG5vZGUwMDAzNjQ0NikgMjcgMCBSCihub2RlMDAwMzY0NDcpIDExMSAwIFIgKG5vZGUwMDAzNjQ0OCkgMTEyIDAgUiAobm9kZTAwMDM2NDQ5KSAxMTMgMCBSIChub2RlMDAwMzY0NTApIDI4IDAgUiAobm9kZTAwMDM2NDUxKSAxMTQgMCBSCihub2RlMDAwMzY0NTIpIDExNSAwIFIgKG5vZGUwMDAzNjQ1MykgMTE2IDAgUiAobm9kZTAwMDM2NDU0KSAxMTcgMCBSIChub2RlMDAwMzY0NTUpIDI5IDAgUiAobm9kZTAwMDM2NDU2KSAxMTggMCBSCihub2RlMDAwMzY0NTcpIDExOSAwIFIgKG5vZGUwMDAzNjQ1OCkgMTIwIDAgUiAobm9kZTAwMDM2NDU5KSAxMjEgMCBSIChub2RlMDAwMzY0NjEpIDEyMiAwIFIgKG5vZGUwMDAzNjQ2MikgMTIzIDAgUgoobm9kZTAwMDM2NDYzKSAxMjQgMCBSIChub2RlMDAwMzY0NjYpIDEyNSAwIFIgKG5vZGUwMDAzNjQ2NykgMzEgMCBSIChub2RlMDAwMzY0NjgpIDEyNiAwIFIgKG5vZGUwMDAzNjQ2OSkgMzIgMCBSCihub2RlMDAwMzY0NzApIDEyNyAwIFIgKG5vZGUwMDAzNjQ3MSkgMTI4IDAgUiAobm9kZTAwMDM2NDc0KSAxMjkgMCBSIChub2RlMDAwMzY0NzUpIDMzIDAgUiAobm9kZTAwMDM2NDc2KSAxMzAgMCBSCihub2RlMDAwMzY0NzcpIDM0IDAgUiAobm9kZTAwMDM2NDc4KSAzNSAwIFIgKG5vZGUwMDAzNjQ3OSkgMzYgMCBSIChub2RlMDAwMzY0ODApIDEzMSAwIFIgKG5vZGUwMDAzNjQ4MSkgMTMyIDAgUgoobm9kZTAwMDM2NDgyKSAxMzMgMCBSIChub2RlMDAwMzY0ODMpIDEzNCAwIFIgKG5vZGUwMDAzNjQ4NCkgMzcgMCBSIChub2RlMDAwMzY0ODUpIDEzNSAwIFIgKG5vZGUwMDAzNjQ4NikgMTM2IDAgUgoobm9kZTAwMDM2NDg3KSAxMzcgMCBSIChub2RlMDAwMzY0ODgpIDM4IDAgUiAobm9kZTAwMDM2NDg5KSAxMzggMCBSIChub2RlMDAwMzY0OTApIDM5IDAgUiAobm9kZTAwMDM2NDkxKSA0MCAwIFIKKG5vZGUwMDAzNjQ5MikgNDEgMCBSIChub2RlMDAwMzY0OTMpIDQyIDAgUiAobm9kZTAwMDM2NDk0KSAxMzkgMCBSIChub2RlMDAwMzY0OTUpIDE0MCAwIFIgKG5vZGUwMDAzNjQ5NikgMTQxIDAgUgoobm9kZTAwMDM2NDk3KSA0MyAwIFIgKG5vZGUwMDAzNjQ5OCkgMTQyIDAgUiAobm9kZTAwMDM2NDk5KSAxNDMgMCBSIChub2RlMDAwMzY1MDApIDE0NCAwIFIgKG5vZGUwMDAzNjUwMSkgMTQ1IDAgUgoobm9kZTAwMDM2NTAyKSAxNDYgMCBSIChub2RlMDAwMzY1MDQpIDQ0IDAgUiAobm9kZTAwMDM2NTA1KSAxNDcgMCBSIChub2RlMDAwMzY1MDcpIDQ1IDAgUiAobm9kZTAwMDM2NTA4KSAxNDggMCBSCihub2RlMDAwMzY1MTApIDQ2IDAgUiAobm9kZTAwMDM2NTExKSAxNDkgMCBSIChub2RlMDAwMzY1MTMpIDQ3IDAgUiAobm9kZTAwMDM2NTE2KSAxNTAgMCBSIChub2RlMDAwMzY1MTcpIDE1MSAwIFIKKG5vZGUwMDAzNjUxOCkgMTUyIDAgUiAobm9kZTAwMDM2NTE5KSA0OCAwIFIgKG5vZGUwMDAzNjUyMykgMTUzIDAgUiAobm9kZTAwMDM2NTI0KSAxNTQgMCBSIChub2RlMDAwMzY1MjUpIDE1NSAwIFIKKG5vZGUwMDAzNjUyNikgNDkgMCBSIChub2RlMDAwMzY1MjcpIDE1NiAwIFIgKG5vZGUwMDAzNjUyOCkgNTAgMCBSIChub2RlMDAwMzY1MzUpIDE1NyAwIFIgKG5vZGUwMDAzNjUzNikgMTU4IDAgUgoobm9kZTAwMDM2NTM3KSAxNTkgMCBSIChub2RlMDAwMzY1MzgpIDE2MCAwIFIgKG5vZGUwMDAzNjUzOSkgNTEgMCBSIChub2RlMDAwMzY1NDQpIDE2MSAwIFIgKG5vZGUwMDAzNjU0NSkgMTYyIDAgUgoobm9kZTAwMDM2NTQ4KSAxNjMgMCBSIChub2RlMDAwMzY1NDkpIDUyIDAgUiAobm9kZTAwMDM2NTUwKSA1MyAwIFIgKG5vZGUwMDAzNjU1MSkgMTY0IDAgUiAobm9kZTAwMDM2NTUyKSA1NCAwIFIKKG5vZGUwMDAzNjU1MykgNTUgMCBSIChub2RlMDAwMzY1NTQpIDU2IDAgUiAobm9kZTAwMDM2NTU1KSA1NyAwIFIgKG5vZGUwMDAzNjU1NikgNTggMCBSIChub2RlMDAwMzY1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';

  */      
 }
  HandleDelte(code: any) {

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
    this.getListGinseng.getListGinseng(number, page).subscribe(
      (data: any) => {
        this.ginseng = data.ginsengs;
        this.amount = data.amount + ' Loại sâm';
        this.size = data.amount;
      },
      (error) => {
        console.log(error.error);
        this.router.navigate(['']);
      }
    );
  }

  setUp() {
    this.pagination.HandleDisable();
    this.item1 = this.pagination.item1;
    this.item2 = this.pagination.item2;
    this.item3 = this.pagination.item3;
    this.isNext = this.pagination.isNext;
    this.isPrev = this.pagination.isPrev;
    this.currentPage = this.pagination.currentPage;
    this.GetList(this.currentPage, this.numberOfItems);
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
    this.isAdd = true;
  }

  uploadImage() {
      var button = document.getElementById('button');
      button?.click();

  }
uploadCerti(){
    var button = document.getElementById('certi');
    button?.click();
  }
handleUploadPdf(event: any){
  const certi = document.getElementById('certi');
  var type = "application/pdf";
  const reader = new FileReader();
  reader.onload = (e) =>{

    const fileUrl =  reader.result;
    var base64String = e.target?.result;
    var mimeType = (base64String as string).match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/);
    if(mimeType && mimeType[1]){
      if(type.includes(mimeType[1])){
        this.temp1 = fileUrl;
        var drag = document.getElementById("certi") as HTMLInputElement;

        this.name_certi = this.getFileNameFromPath(drag.value as string);
        let open = document.getElementById("display");
        if(open){
          open.addEventListener("click",this.showCertificate);
        }
    }
  };

}
if (event.target.files && event.target.files.length > 0) {
  reader.readAsDataURL(event.target.files[0]);
  this.certificate = event.target.files[0];
}
}
showCertificate(){
  let show = document.getElementById("file-link");
  show?.click();
}
getFileNameFromPath(filePath: string): string {
  // Sử dụng đối tượng URL để trích xuất tên tệp tin từ đường dẫn
  const url = new URL(filePath);
  let url_new = url.pathname.split('\\fakepath\\').pop() || ''; // Lấy phần cuối cùng của đường dẫn
  if (url_new.length > 24) {
    return url_new.substring(0, 15) + '...' + url_new.slice(-4);
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
        var mimeType = (base64String as string).match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/);
        let type = ['image/png', 'image/jpg', 'image/jpeg', 'image/ico'];
        let length : any
        length =  this.imagesArray?.length ;
        if (mimeType && mimeType[1]) {
          if(type.includes(mimeType[1]) && (length < 5)) {
            this.imagesArray?.push(imgUrl);
            this.temp12?.push(event.target.files[0]);
            if(this.imagesArray?.length == 5){
              this.isRender = false;
              var drag = document.getElementById("drag");
              drag?.classList.add("disabled-image");
              this.allowDropImages = false;
            }
            const temp = document.createElement('img') as HTMLImageElement;
            temp.src = imgUrl as string;
            check?.classList.add('active');
            addSvg?.setAttribute("style", "display : none");
          }
          else {
            this.toastr.error("Định dạng file không hợp lệ. Chỉ chấp nhận định dạng ảnh!","Lỗi upload ảnh");
          }
        } 
    };

    if (event.target.files && event.target.files.length > 0) {
      
      this.temp1 = event.target.files[0];
        reader.readAsDataURL(event.target.files[0]);
        this.temp12?.push(event.target.files[0]);
    }
}
deleteImage(index: number) {
    this.imagesArray?.splice(index, 1);
    if (this.imagesArray?.length === 5) {
      this.isRender = false;
      this.allowDropImages = false; 
    } else {
      this.isRender = true;
      this.allowDropImages = true; 
    }
}
formatDate(date: Date | null): any {
  return date ? this.datePipe.transform(date, 'dd/MM/yyyy') : '';
}
onDateSelected(date: Date) {
  this.selected = date;
  this.showCalendar = false;
  let temp = document.getElementById('date') as HTMLInputElement;
  temp.value = this.formatDate(date);
  console.log(temp.type);
}
handleClose(){
  this.isAdd = false;
  this.showCalendar = false;
  this.imagesArray = [];
  this.selected = null;
}

handleImageDrop(event: DragEvent) {

  event.preventDefault();
  event.stopPropagation();
  if (!this.allowDropImages) {
    return;
  }
  const element = event.target as HTMLElement;
  console.log(event.target);
  element.classList.remove('drag-over');
  const files = event.dataTransfer?.files;

  if(files != null){
      if (files.length > 0) {
      // Xử lý mỗi file ảnh ở đây
      const imageFile = files[0];
      this.processImageFile(imageFile);
  }
  }
  if (!this.isRender) {
    // Nếu sự kiện đã được xử lý, ngừng lắng nghe và thoát khỏi hàm
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
      // Xử lý imgUrl, có thể thêm vào mảng ảnh, hiển thị, hoặc thực hiện các hành động khác.
      this.imagesArray?.push(imgUrl);
      if(this.imagesArray?.length == 5){
        this.isRender = false;
        var drag = document.getElementById("drag");
        drag?.classList.add("disabled-image");
        drag?.setAttribute("style", "-webkit-user-drag: none; user-drag: none; moz-user-drag: none");
        this.allowDropImages = false;
      }
      // Gọi hàm xử lý khi ảnh được thêm vào

  };
  reader.readAsDataURL(file);
}
  async handleAddGinseng(codeInput:any, nameInput: any, dateInput: any, sourceInput: any, effectInput: any, moreInput: any){
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
    const month = parseInt(parts[1], 10) - 1; // Tháng trong JavaScript bắt đầu từ 0
    const year = parseInt(parts[2], 10);
    
    let more_info = '';
    let created_date = new Date(year, month, day);
    if(moreInput != null){
      more_info = moreInput.value;
    }
    let obj = {code, created_date, name,source, effect, more_info};
    if(this.temp12 != null){
      this.addService.addGinseng(obj,  this.temp12,this.certificate).subscribe((data: any) =>{
        this.toastr.success('Chúc mừng, bạn đã thêm sản phẩm thành công!','Đã thêm sản phẩm thành công');
        this.handleClose();
        this.setUp();
      },
      error => {
        this.toastr.error('Đã có lỗi trong quá trình xử lý dữ liệu của bạn. Vui lòng kiểm tra và thử lại sau' , 'Lỗi thêm sản phẩm');
      });
    }
  }
}


