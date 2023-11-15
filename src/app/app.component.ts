import { Component, Inject } from '@angular/core';
import { AppService } from './services/app-service/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from './services/api-service/auth-service/login.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Angular-new';

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private AppService: AppService, 
    @Inject(LoginService) private login: LoginService,
    private toastr: ToastrService) {
    let token: string | null = sessionStorage.getItem('token');
    if(token == null) 
    {token = localStorage.getItem('token');}
    if (token != null) {
      this.login.validateToken({token:token}).subscribe({
        next: (data:any) => {
          if(data == "true"){
          this.router.navigate(['admin']);
        }
      },
      error:data =>{
        if(data == "Token is not valid"){
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['login']);
        }
        if(data == "Expired token"){
          localStorage.clear();
          sessionStorage.clear();
          this.toastr.warning("Phiên đăng nhập đã hết. Vui lòng đăng nhập lại","Lỗi đăng nhập");
          
        }
      }
    });
  }
    else if(token == null) {
      this.router.navigate(['login']);
    } 
  }
}
