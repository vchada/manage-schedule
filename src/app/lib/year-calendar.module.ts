import { NgModule } from '@angular/core';
import { YearCalendarComponent } from './components/year-calendar/year-calendar.component';
import { YearCalendarService } from './year-calendar.service';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { WeekNumberPipe } from './pipes/week-number/week-number.pipe';

@NgModule({
  declarations: [
    YearCalendarComponent,
    WeekNumberPipe
  ],
  imports: [
    CommonModule,
    OverlayModule
  ],
  exports: [
    YearCalendarComponent,
    WeekNumberPipe
  ]
})
export class YearCalendarModule {
  static forRoot() {
    return {
      ngModule: YearCalendarModule,
      providers: [
        YearCalendarService
      ]
    };
  }
}
