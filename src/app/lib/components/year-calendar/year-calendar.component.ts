import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ViewChild, TemplateRef } from '@angular/core';
import { YearCalendarService } from '../../year-calendar.service';
import { YCConfig } from '../../year-calendar-interfaces';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { DEFAULT_CONFIG } from '../../constants/default-config';
import { CommonDataService } from 'src/app/services/common-data.service';

export const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];


@Component({
  selector: 'yc-year-calendar',
  templateUrl: './year-calendar.component.html',
  styleUrls: ['./year-calendar.component.scss']
})
export class YearCalendarComponent implements OnInit, OnChanges {
  @Input() selectedDates: any;
  @Input() customDateSelection: boolean= true;
  @Input() loadingData: boolean;
  @Input() ycConfig: YCConfig = DEFAULT_CONFIG;
  @Input() daysOfWeek: any = [...DAYS_OF_WEEK];
  @Output() eventDayClicked = new EventEmitter<any>();
  @Output() viewYearChanged = new EventEmitter<any>();
  @ViewChild('defaultHeaderTemplate', {static: true}) defaultHeaderTemplate: TemplateRef<any>;
  year = new Date().getFullYear();
  yearData = [];
  maxValueInYear: number;
  currentDate: Date = new Date();
  disablePrev = false;
  disableNext = false;
  constructor(
    private ycService: YearCalendarService,
    private commonDataService:CommonDataService
  ) { }

  ngOnInit() {
    this.ycConfig.headerTemplate = this.ycConfig.headerTemplate || this.defaultHeaderTemplate;
    let minyear = new Date().getFullYear();
      this.disableNext = false;
      this.disablePrev = false;
      if((this.year) > minyear) {
        this.disablePrev = false;
      } else if((this.year) === minyear) {
        this.disablePrev = true;
      } else {
        this.disablePrev = false;
      }

      let maxyear = new Date().getFullYear() + 10;
      if((this.year) < maxyear) {
        this.disableNext = false;
      } else if((this.year) === maxyear) {
        this.disableNext = true;
      } else {
        this.disableNext = true;
      }
    // this.render(this.currentDate.getFullYear());
    this.commonDataService.yearChangeEvt.subscribe((year: any) => {      
      this.render(year);

      let minyear = new Date().getFullYear();
      this.disableNext = false;
      this.disablePrev = false;
      if((year) > minyear) {
        this.disablePrev = false;
      } else if((this.year) === minyear) {
        this.disablePrev = true;
      } else {
        this.disablePrev = false;
      }

      let maxyear = new Date().getFullYear() + 10;
      if((year) < maxyear) {
        this.disableNext = false;
      } else if((year) === maxyear) {
        this.disableNext = true;
      } else {
        this.disableNext = true;
      }

    })

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ycConfig) {
      const previousValue: YCConfig = changes.ycConfig.previousValue;
      const currentValue: YCConfig = changes.ycConfig.currentValue;
      this.ycConfig = {
        ...DEFAULT_CONFIG,
        ...this.ycConfig
      };
      this.ycConfig.headerTemplate = this.ycConfig.headerTemplate || this.defaultHeaderTemplate;
      if (
        previousValue && currentValue &&
        ((previousValue.data.length !== currentValue.data.length) ||
        (previousValue.data[0] && currentValue.data[0] &&
        previousValue.data[0].date !== currentValue.data[0].date)) ||
        (previousValue && this.ycService.isYearDataChanged(previousValue.data, currentValue.data)) ||
        (previousValue && this.ycService.isConfigChanged(previousValue, currentValue))
      ) {
        this.render(this.year);
      }
    }

    if (changes.selectedDates) {
      // if (changes.selectedDates.previousValue && changes.selectedDates.currentValue !== changes.selectedDates.previousValue) {
      //   this.render(new Date(changes.selectedDates.currentValue.date).getFullYear(), changes.selectedDates.currentValue.list);

      // }

      if (changes.selectedDates && changes.selectedDates.currentValue !== changes.selectedDates.previousValue) {
        this.render(new Date(changes.selectedDates.currentValue.date).getFullYear(), changes.selectedDates.currentValue.list);
      }


    }
  }

  /**
   * @author Ahsan Ayaz
   * @desc Creates the months data and assigns to `yearData` which is rendered on the view
   * @param date - date of the year to render
   */
  render(year: number = this.year, selectedDates?) {
    this.year = year;
    this.daysOfWeek = [...this.getDaysOfWeek()];
    this.yearData = new Array(12).fill(0).map((_, monthIndex) => {
      return {
        date: new Date(this.year, monthIndex + 1, 0),
        weeks: this.createDaysOfMonth(monthIndex, this.year, selectedDates),
        weekNumbers: this.ycService.getWeekNumbers(monthIndex, this.year, this.ycConfig)
      };
    });
  }

  getDaysOfWeek() {
    const days = [];
    for (let i = this.ycConfig.weekStartsOn, len = this.ycConfig.weekStartsOn + this.daysOfWeek.length; i < len; ++i) {
      days.push(DAYS_OF_WEEK[i % (this.daysOfWeek.length)]);
    }
    return days;
  }

  /**
   * @author Ahsan Ayaz
   * @desc Returns the dates of the entire month
   * @param monthIndex - index of the month of which the days are to be calculated
   * @param year - the year which is displayed on the view
   */
  createDaysOfMonth(monthIndex, year, selectedDates) {
    // getting the weeks of the month to calculate rows on month view
    const monthWeeksData = this.ycService.getMonthWeeks(monthIndex, year, this.ycConfig.weekStartsOn);
    const {
      monthWeeksCount,
      lastDayOfMonth,
      monthLastDate
    } = monthWeeksData;
    let { firstDayOfMonth } = monthWeeksData;
    const daysOfWeeks = [];
    const todayStr = new Date().toDateString(); // will be used to identify if a date is `today`
    let currentDate = 1; // this will keep a count of the overall dates of the months
    let lastDayOfWeek = 7;
    let maxValueInYear = 0;
    // Looping through the weeks to add appropriate dates to particular week
    for (let weekIndex = 0; weekIndex < monthWeeksCount; weekIndex++) {
      daysOfWeeks[weekIndex] = [];  // creating an empty array for each week to store days/dates
      if (monthWeeksCount === weekIndex + 1) {  // if we're at the last week of the month
        lastDayOfWeek = lastDayOfMonth + 1; // setting the last day to last day of the month
      }
      if (weekIndex > 0) {  // for every week except the first week
        firstDayOfMonth = 0;  // set the first day of the week to first column
      }
      // for every week, start from the first day (column) and keep adding dates/days respectively till the last day of week
      for (let indexDay = firstDayOfMonth; indexDay < lastDayOfWeek; indexDay++) {
        const currDate = new Date(year, monthIndex, currentDate);
        if (currDate.getTime() > monthLastDate.getTime()) {
          break;
        }
        const currDayString = currDate.toDateString();
        const isToday = currDayString === todayStr; // if the current date is actually today
        let isSelected = this.selectedDates.list.find(date => new Date(date).toDateString() === currDayString)? true: false;
        const dayValue = this.assignDataCountToDate(currDayString).count;
        daysOfWeeks[weekIndex][indexDay] = {  // setting the day of the week in the structure
          day: currentDate,
          isToday: isToday,
          isSelected: isSelected, 
          value: dayValue,
          date: currDate
        };
        if (dayValue > maxValueInYear) { // saving the max year count value
          maxValueInYear = dayValue;
        }
        currentDate++; // incrementing the date counter after each date's addition to the date structure
      }
    }
    if (maxValueInYear > this.ycConfig.maxValue) {
      this.maxValueInYear = maxValueInYear;
    } else {
      this.maxValueInYear = Number(this.ycConfig.maxValue);
    }
    return daysOfWeeks.filter(weekData => {
      return weekData.length !== 0;
    });
  }

  assignDataCountToDate(currDayString) {
    let dateData = this.ycConfig.data.find((dataItem) => {
      const itemDate = dataItem.date;
      if (!itemDate) {
        return false;
      }
      return new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()).toDateString() === currDayString;
    });
    if (!dateData) {
      const dataIndex = this.ycConfig.data.findIndex((dataItem) => {
        return dataItem.date === null;
      });

      if (dataIndex >= 0) {
        dateData = {...this.ycConfig.data[dataIndex]};
        this.ycConfig.data[dataIndex].date = new Date(currDayString);
      }
    }
    return {
      count: dateData && dateData.count ? dateData.count : 0
    };
  }

  nextYearClick() {
    let maxyear = new Date().getFullYear() + 10;
    this.disablePrev = false;
    if((this.year + 1) <= maxyear) {
      this.disableNext = false;
      this.selectedDates.list = [];
      this.render(this.year + 1, this.selectedDates.list);
      this.viewYearChanged.emit(this.year);
    } else {
      this.disableNext = true;
    }
  }

  prevYearClick() {
    let minyear = new Date().getFullYear();
    this.disableNext = false;
    this.disablePrev = true;
    if((this.year - 1) > minyear) {
      this.disablePrev = false;

      this.selectedDates.list = [];
      this.render(this.year - 1, this.selectedDates.list);
      this.viewYearChanged.emit(this.year);
    } else if((this.year - 1) === minyear) {
      this.disablePrev = true;

      this.selectedDates.list = [];
      this.render(this.year - 1, this.selectedDates.list);
      this.viewYearChanged.emit(this.year);
    } else {
      this.disablePrev = true;
    }
  }

  todayClick() {
    this.render(new Date().getFullYear());
  }

  eventDayCick(day, trigger: CdkOverlayOrigin) {
    if(this.customDateSelection) {
      let selectedIndex = this.selectedDates.list.findIndex(date => new Date(date).toDateString() === new Date(day.date).toDateString());
      if (selectedIndex > -1) {
        this.selectedDates.list = this.selectedDates.list.filter(date => new Date(date).toDateString() !== new Date(day.date).toDateString());
      } else {
        this.selectedDates.list.push(new Date(day.date));
      }
      this.eventDayClicked.emit({
        day,
        trigger
      });
      this.render(this.year, this.selectedDates.list);
    }
  }

}
