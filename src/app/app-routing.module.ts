import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasicGuard } from './basic.guard';
import { CreateRoleComponent } from './create-role/create-role.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { PendingChangesGuard, PendingRuleChangesGuard } from './pending-changes.gaurd';
import { ScheduleComponent } from './schedule/schedule.component';


const routes: Routes = [
  {path: '', component: LoginComponent, pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent, canActivate: [BasicGuard]},
  {path: 'schedule', component: ScheduleComponent, canDeactivate: [PendingChangesGuard], canActivate: [BasicGuard]},
  {path: 'create-rule', component: CreateRoleComponent, canDeactivate: [PendingRuleChangesGuard], canActivate: [BasicGuard]},
  {path: 'manage-profile', loadChildren: () => import('./manage-profile/manage-profile.module').then(m => m.ManageProfileModule), canActivate: [BasicGuard]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
