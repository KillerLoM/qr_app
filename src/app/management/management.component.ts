import { Component } from '@angular/core';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent {
  constructor(){}
  HandleNews(){
    let newsElement = document.getElementById('news-id') as HTMLElement ;
    newsElement.style.color =  '#22493b';
  }
}
