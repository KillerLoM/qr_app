import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './component/admin-component/admin.component';
import { AppService } from './services/app-service/app.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginService } from './services/api-service/auth-service/login.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgToastModule } from 'ng-angular-popup';
import { ToastrModule } from 'ngx-toastr';
import { NgOtpInputModule } from 'ng-otp-input';
import { ManagementComponent } from './component/management/management.component';
import { InterceptorService } from './interceptor/interceptor.service';
import { GinsengManagementComponent } from './component/management/ginseng-management/ginseng-management.component';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatInputModule } from '@angular/material/input';
import {  MatFormFieldModule } from '@angular/material/form-field';
import {  MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { WineManagementComponent } from './component/management/wine-management/wine-management.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ManagementComponent,
    GinsengManagementComponent, 
    WineManagementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCardModule,
    BrowserAnimationsModule,
    NgOtpInputModule,
    ToastrModule.forRoot({            
    positionClass: 'toast-top-right',
    easing: 'ease-in',
    easeTime: 300,
    progressBar: true,
    progressAnimation: 'increasing',
    includeTitleDuplicates: true,
    preventDuplicates: false,
    timeOut: 10000}
    ),
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule

  ],
  providers: [AppService, LoginService, {
    provide: HTTP_INTERCEPTORS, 
    useClass: InterceptorService,
    multi: true,

  },
  { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' }],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}

