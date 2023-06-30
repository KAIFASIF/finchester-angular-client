import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './screens/signin/signin.component';
import { AuthGuard } from './services/auth.guard';


// const routes: Routes = [
//   { path: 'signin', component: SigninComponent, canActivate: [AuthGuard] },
//   { path: '', loadChildren: () => import('./screens/user/user.module').then(m => m.UserModule) },
// ];

const routes: Routes = [
  { path: 'signin', component: SigninComponent},
  { path: '', loadChildren: ()=>import('./screens/user/user.module').then(m=>m.UserModule) },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
