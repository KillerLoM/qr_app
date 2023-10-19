import { Component } from '@angular/core';
import { AppService } from './app.service';
import { catchError } from 'rxjs';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Angular-new';

  constructor(private route: ActivatedRoute, private router: Router, private AppService: AppService) {
    let token: string | null = localStorage.getItem('token');
    if(token == null) 
    {token = sessionStorage.getItem('token');}
    if (token) {
      this.AppService.validateToken({token:token}).subscribe((data:any) => {
        if(data == 'valid'){
          this.router.navigate(['admin']);
        }
        else {
          this.router.navigate(['login']);
        }
      }
      )
    }
    else {
      this.router.navigate(['admin']);
    } 
  }
}
