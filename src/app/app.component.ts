import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular-new';
  passwordEmpty = true;
  emailEmpty = true;
  validEmail = true;
  public changeImg(){
  console.log(1);
  const pwdType = document.getElementById("type");
  const toggle = document.getElementById("visibility");
  
  if(pwdType?.getAttribute("type") === 'password'){
    document.getElementById("visibility")?.setAttribute("src","./assets/visibility_off.png");
    document.getElementById("type")?.setAttribute("type","text");
  }
  else{
    document.getElementById("visibility")?.setAttribute("src","./assets/remove_red_eye.png");
    document.getElementById("type")?.setAttribute("type","password");
  }
  }
  public forgetPassword(){
    document.getElementById("HOME")?.setAttribute("style","display:none;");
    document.getElementById("forgetPassword")?.setAttribute("style","display:flex;");
  }
  public signIn(email: HTMLInputElement, pwd: HTMLInputElement){
    this.validateEmail(email.value);
  if (!this.validEmail) {
      alert("Vui lòng nhập đúng định dạng email");
      document.g
      document.getElementById("input")?.setAttribute("placeholder","Email đúng định dạng sẽ là abc@gmail.com");
    }
    else{
        console.log(email.value);
        console.log(pwd.value);
    }
  }
validateEmail(email: string) {
  const re = /^[^\s@]+@gmail\.com$/;
  this.validEmail = re.test(email);
}
onEmailInput(event: any){
  this.emailEmpty = !event.target.value;
}
  
onPasswordInput(event: any){
  this.passwordEmpty = !event.target.value;
}
}
