import { Component, Renderer2, ElementRef, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { GetGinsengsService } from 'src/app/services/api-service/ginseng-service/get-ginsengs.service';
import { Ginseng } from '../../../model/ginseng';
import { PaginationService } from 'src/app/services/app-service/pagination.service';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ginseng-management',
  templateUrl: './ginseng-management.component.html',
  styleUrls: ['./ginseng-management.component.scss', '../../../app.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class GinsengManagementComponent {
  ginseng: Ginseng[] | null = null;
  img: HTMLImageElement | null = null;
  amount = '';
  numberOfItems = 10;
  inputFile: any;
  isRender = true;
  temp1: any;
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

  constructor(
    @Inject(GetGinsengsService) private getListGinseng: GetGinsengsService,
    private pagination: PaginationService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.getListGinseng.getListGinseng(this.numberOfItems, 0).subscribe(
      (data: any) => {
        this.ginseng = data.ginsengs;
        this.imagesArray = [];
        console.log(this.ginseng?.length);
        if (this.ginseng == null) {
        } else {
          for (let i of this.ginseng) {
            console.log(i.code);
            console.log(i.name);
            console.log(i?.created_date);
          }
        }
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
    alert(1);
  }

  uploadImage() {
      var button = document.getElementById('button');
      button?.click();

  }

  handleUploadImage(event: any) {
    const check = document.getElementById('image-render');
    const addSvg = document.getElementById('Add');
    const reader = new FileReader();

    reader.onload = () => {
        const imgUrl = reader.result;
        this.imagesArray?.push(imgUrl);
        if(this.imagesArray?.length == 5){
          this.isRender = false;
        } // Thêm đường dẫn hình ảnh vào mảng
        const temp = document.createElement('img') as HTMLImageElement;
        temp.src = imgUrl as string;
        // Thêm class 'render-atom' cho phần tử img
        // check?.appendChild(temp);

        // Update styles and display
        check?.classList.add('active');
        addSvg?.setAttribute("style", "display : none");
      
    };

    if (event.target.files && event.target.files.length > 0) {
        reader.readAsDataURL(event.target.files[0]);
    }
}

// Hàm xóa hình ảnh từ mảng
deleteImage(index: number) {
    this.imagesArray?.splice(index, 1);
    // Thực hiện các thao tác xóa khác nếu cần
    if(this.imagesArray?.length == 5){
      this.isRender = false;
    }
    this.isRender = true;
}

}
