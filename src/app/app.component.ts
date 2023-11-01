import { Component, Inject } from '@angular/core';
import { AppService } from './services/app-service/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from './services/api-service/auth-service/login.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Angular-new';

  constructor(private route: ActivatedRoute, private router: Router, private AppService: AppService, @Inject(LoginService) private login: LoginService,) {
    let token: string | null = sessionStorage.getItem('token');
    if(token == null) 
    {token = localStorage.getItem('token');}
    if (token != null) {
      console.log(token);
      this.login.validateToken({token:token}).subscribe((data:any) => {
        console.log(data);
        if(data == 'valid'){
          this.router.navigate(['admin']);
          
        }
        else {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['login']);
        }
      }
      )
    }
    else if(token == null) {
      this.router.navigate(['login']);
    } 
  }
}
