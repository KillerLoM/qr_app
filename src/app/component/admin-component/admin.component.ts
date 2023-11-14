import { Component, Inject } from '@angular/core';
import { AppService } from '../../services/app-service/app.service';
import { catchError } from 'rxjs';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/api-service/auth-service/login.service';
import { ForgetPasswordService } from 'src/app/services/api-service/auth-service/forget-password.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  title = 'Angular-new';
  VisibilityInstruction = 'visibility';
  isOTP = false;
  isLoading = false;
  isReset = false;
  isForget = false;
  setPwd = false;
  setPassword = false;
  completted = false;
  startTime = 5;
  emailUser = "";
  passwordMatcher(control: AbstractControl): ValidationErrors | null {
    const passwordControl = control.get('newPasswordFormControl'); 
    const confirmPasswordControl = control.get('confirmPasswordFormControl'); 

    if (passwordControl?.value !== confirmPasswordControl?.value) {
      return { passwordNotMatch: true };
    }
    return null;
  }
  temp = "";
  constructor(private appService: AppService, 
    @Inject(LoginService) private login: LoginService, 
   private toastr: ToastrService, private router: Router,
   @Inject(ForgetPasswordService) private forget: ForgetPasswordService) { }
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
  public changeToggleReset() {
    const pwdType = document.getElementById("pwdNew");
    if (pwdType?.getAttribute("type") === 'password') {
      this.VisibilityInstruction = 'visibility_off';
      pwdType?.setAttribute("type", "text");
      document.getElementById("pwdValidate")?.setAttribute("type", "text");

    }
    else {
      this.VisibilityInstruction = 'visibility';
      pwdType?.setAttribute("type", "password");
      document.getElementById("pwdValidate")?.setAttribute("type", "password");
    }

  }
  public forgetPassword() {
    this.isForget = !this.isForget;
  }
  async resetPassword(emailReset: HTMLInputElement) {
    this.isLoading = true;
    this.emailUser = emailReset.value;
    this.forget.resetPassword({ email: emailReset.value }).subscribe((response: any) => {
      try {
        if (response == "Email is not created or wrong. Please check and try again") {
          this.isLoading = false;
          this.toastr.error("Email bạn vừa nhập có vẻ không đúng. Vui lòng kiểm tra và thử lại", "Email chưa được gửi", {

          });
        }
        else {
          this.isLoading = false;
          this.toastr.success("Mã otp đã được gửi về email của bạn. Vui lòng kiểm tra và nhập vào form bên dưới", "Email đã được gửi");
          this.isReset = true;
        }
      } catch (error) {
        this.toastr.error(response,"Lỗi xác thực OTP");
        return;
      }
    },);
  }
  async sendEmailAgain(){
    this.isLoading = true;
    this.forget.resetPassword({ email: this.emailUser}).subscribe((response: any) => {
      try {
        if (response == "Email is not created or wrong. Please check and try again") {
          this.isLoading = false;
          this.toastr.error("Email bạn vừa nhập có vẻ không đúng. Vui lòng kiểm tra và thử lại", "Email chưa được gửi", {

          });
        }
        else {
          this.isLoading = false;
          this.toastr.success("Mã otp đã được gửi về email của bạn. Vui lòng kiểm tra và nhập vào form bên dưới", "Email đã được gửi");
        }
      } catch (error) {
        this.toastr.error(response,"Lỗi gửi mã OTP");
        return;
      }
    },error =>{
      this.toastr.error("Đã có lỗi trong quá trình gửi OTP. Vui lòng thử lại","Lỗi gửi mã OTP");
    });
  }
  async signIn(emailInput: HTMLInputElement, pwdInput: HTMLInputElement, saveInput: HTMLInputElement) {
    let email = emailInput.value;
    let password = pwdInput.value;
    let obj = { email, password };
    this.login.onlogin(obj).subscribe({
      next: (data: any) => {
        if (data.message == 'ok') {
          var token = data.token;
          if (saveInput.checked == true) {
            localStorage.setItem('token', token);
            this.router.navigate(['']);
          }
          else {
            sessionStorage.setItem('token', token);
            this.router.navigate(['']);
          }
        }
      },
      error: data => {
        this.toastr.error("Bạn đã nhập sai tài khoản hoặc mật khẩu. Vui lòng kiểm tra và thử lại sau!" ,"Lỗi xác thực");
      }
    });
    
  }
  loginForm!: FormGroup;
  resetForm!: FormGroup;
  otpForm!: FormGroup;
  newPasswordForm!: FormGroup;
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
    });
    this.otpForm = new FormGroup({
      otpFormControl: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
      ]),
    });
    this.newPasswordForm = new FormGroup({
      newPasswordFormControl: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirmPasswordFormControl: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ])
    },
    {
      validators: this.passwordMatcher
    });  
  }
  config = {
    length: 4,
    placeholder: '-',
    allowNumbersOnly: true,
    focusable: true,
    refreshing: true,
    inputStyles: {
      'width': '74px',
      'height': '74px',
      'font-family': 'Lexend',
      'flex-grow': '0',
      'padding': '35px 17px',
      'border-radius': '12px',
      'border': 'solid 1px #9ea4aa',
      'margin-left': '20px'
    },
  }
  validateOTP(otp: any) {
    this.isOTP = false;
    this.temp = otp;
    if (otp.length > 3) {
      this.isOTP = true;
      document.getElementById("otpInput")?.addEventListener("keypress", function (e) {
        if (e.key == "Enter") {
          document.getElementById("otpSEND")?.click();
        }
      });
    }
  }
  async setNewPassword(newPassword: HTMLInputElement) {
    let email = this.emailUser;
    let password =  newPassword.value;
    let obj = {email, password};
    this.forget.setNewPwd(obj).subscribe((data: any )=> {
      if(data == "OK"){
        setInterval(() => this.updateTimer(), 1000);
        this.completted = true;
        this.setPwd = false;
        this.isReset = false;
        this.isForget = false;
        document.getElementById("abc")?.setAttribute("style", "display:flex");
      }
    })
  }
  handleOtp(otp: string) {
    this.forget.validateOTP(this.temp).subscribe((response: any) => {
      try {
        if (response == "OK") {
          document.getElementById("expiredOTP")?.setAttribute("style","display:none");
          this.setPwd = true;
        }
        else {
          this.toastr.error("Sai mã OTP. Vui lòng nhập chính xác OTP !" ,"Lỗi xác thực OTP");
        }
      } catch (error) {
        this.toastr.error("Đã có lỗi trong quá trình xác thực OTP. Vui lòng thử lại sau !" ,"Lỗi xác thực OTP");
      }
    },error => {
      if(error.error == "otp has been expired. Please send again!"){
        this.toastr.error("OTP đã hết hạn. Vui lòng bấm gửi lại để gửi lại OTP mới" ,"Lỗi xác thực OTP");
        document.getElementById("expiredOTP")?.setAttribute("style","display:flex");
      }
      else {
        document.getElementById("expiredOTP")?.setAttribute("style","display:none");
        this.toastr.error("OTP bạn vừa nhập không chính xác. Vui lòng kiểm tra và thử lại sau !" ,"Lỗi xác thực OTP");
      }
      
    });

    this.temp = "";
  }

  updateTimer(){
    this.startTime --;
    if(this.startTime <0){
      this.startTime = 5;
      document.getElementById("abc")?.setAttribute("style", "display:none");
      this.completted = false;
      
    }
  }
}

