import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ManagementComponent } from './management/management.component';
import { AppComponent } from './app.component';
const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    title: 'PROJECT',
  },
  {
    path: 'admin',
    component: ManagementComponent,
    title: 'Home Page',
  },
  {
    path: 'login',
    component: AdminComponent,
    title: 'Login Admin',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export default routes;

