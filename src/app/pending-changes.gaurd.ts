
import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduleComponent } from './schedule/schedule.component';
import { CreateRoleComponent } from './create-role/create-role.component';


@Injectable()
export class PendingChangesGuard implements CanDeactivate<ScheduleComponent> {
  canDeactivate(component: ScheduleComponent): boolean | Observable<boolean> {
    return !component.unSavedChanges ?
      true :
      confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
  }
}

@Injectable()
export class PendingRuleChangesGuard implements CanDeactivate<CreateRoleComponent> {
  canDeactivate(component: CreateRoleComponent): boolean | Observable<boolean> {
    return !component.unSavedChanges ?
      true :
      confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
  }
}