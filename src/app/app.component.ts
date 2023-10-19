import { Component } from '@angular/core';
import { AppService } from './app.service';
import { catchError } from 'rxjs';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular-new';
  VisibilityInstruction = 'visibility';

  url = 'http://localhost:5050/admin/authenticate';
  constructor(private appService: AppService){}
  public changeToggle() {
    const pwdType = document.getElementById("pwd");
    if (pwdType?.getAttribute("type") === 'password') {
      this.VisibilityInstruction = 'visibility_off';
      pwdType?.setAttribute("type", "text");
    }
    else {
      
      this.VisibilityInstruction = 'visibility';
      pwdType?.setAttribute("type", "password");
    }
  }
  public forgetPassword() {
    document.getElementById("HOME")?.setAttribute("style", "display:none;");
    document.getElementById("forgetPassword")?.setAttribute("style", "display:flex;");
  }
  async resetPassword(emailReset: HTMLInputElement){
      alert("Vui lòng nhập đúng định dạng email");
      emailReset.value = "";
  }
  async signIn(emailInput: HTMLInputElement, pwdInput: HTMLInputElement, saveInput: HTMLInputElement) {
      let email = emailInput.value;
      let password = pwdInput.value;
      console.log(saveInput.checked);
      let obj = {email, password};
      this.appService.onlogin(obj).subscribe((data:any)=>{
        if(data.status == 'success'){
          console.log(data.status);
          if(saveInput.checked == true ) {
            localStorage.setItem('token', data.token);
          } 
        }
      }, error => {
        // Xử lý lỗi tại đây
        console.error( error.error);
      });
    }
  test(){
    console.log(1); 
  }
  loginForm!: FormGroup;
  resetForm!: FormGroup;
  
  ngOnInit() {
    this.loginForm = new FormGroup({
        emailFormControl: new FormControl('', [
            Validators.required,
            Validators.pattern("^[a-z0-9._%+-]+@gmail+\\.com")
        ]),
        passwordFormControl: new FormControl('', [
            Validators.required,
        ]),
    });
    this.resetForm = new FormGroup({
      emailResetFormControl: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@gmail+\\.com")
    ]),
    })
  }

  onSubmit() {
    console.log(this.loginForm.value);
    // Use this.loginForm.value to get form data
  }
}
