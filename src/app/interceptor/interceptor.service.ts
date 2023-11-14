import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor() {
  }
  intercept(
    req: HttpRequest<any>, 
    next: HttpHandler) : Observable<HttpEvent<any>> {
      if(localStorage.getItem("token") != null){
        const token = localStorage.getItem("token");
        const headers = new HttpHeaders().set("Content-Type", "application/json").set('Authorization','Bearer ' + token);
        const AuthRequest = req.clone({headers: headers});
        return next.handle(AuthRequest); 
      }
      else if(sessionStorage.getItem("token")!= null){
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders().set("Content-Type", "application/json").set('Authorization','Bearer ' + token);
        const AuthRequest = req.clone({headers: headers});
        return next.handle(AuthRequest); 
      }
      else{
        return next.handle(req);
      }
  }
}
