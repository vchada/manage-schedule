import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateRoleComponent } from './create-role/create-role.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ScheduleComponent } from './schedule/schedule.component';


const routes: Routes = [
  {path: '', component: DashboardComponent, pathMatch: 'full'},
  {path: 'schedule', component: ScheduleComponent},
  {path: 'create-rule', component: CreateRoleComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
