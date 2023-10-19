import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgToastModule } from 'ng-angular-popup';
import { ToastrModule } from 'ngx-toastr';
import { NgOtpInputModule } from 'ng-otp-input';
import { ManagementComponent } from './management/management.component';
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
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
      

  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
