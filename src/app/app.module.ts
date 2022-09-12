import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExampleSectionComponent } from './components/example-section/example-section.component';
import { YearCalendarModule } from './lib/year-calendar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from '@angular/material/select'; 
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateRoleComponent } from './create-role/create-role.component';
import { ScheduleComponent } from './schedule/schedule.component'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';

import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { AutoCompleteComponent } from './components/auto-complete/auto-complete.component';
import { MatTableFilterModule } from 'mat-table-filter';
import { CalendarTableComponent } from './dashboard/calendar-table/calendar-table.component';
import { RuleTableComponent } from './dashboard/rule-table/rule-table.component';
import { PendingChangesGuard, PendingRuleChangesGuard } from './pending-changes.gaurd';
import { MultipleSelectionComponent } from './components/multiple-selection/multiple-selection.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ManageProfileComponent } from './manage-profile/manage-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    ExampleSectionComponent,
    CreateRoleComponent,
    ScheduleComponent,
    DashboardComponent,
    AutoCompleteComponent,
    CalendarTableComponent,
    RuleTableComponent,
    MultipleSelectionComponent,
    ManageProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    YearCalendarModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
        MatPaginatorModule,
        MatSortModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatTableFilterModule,
    NgxMatSelectSearchModule
  ],
  providers: [PendingChangesGuard, PendingRuleChangesGuard],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }

