import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateRoleComponent } from './create-role/create-role.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PendingChangesGuard, PendingRuleChangesGuard } from './pending-changes.gaurd';
import { ScheduleComponent } from './schedule/schedule.component';


const routes: Routes = [
  {path: '', component: DashboardComponent, pathMatch: 'full'},
  {path: 'schedule', component: ScheduleComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'create-rule', component: CreateRoleComponent, canDeactivate: [PendingRuleChangesGuard]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
