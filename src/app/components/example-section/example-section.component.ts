import { Component, OnInit, EventEmitter, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, Output } from '@angular/core';
import { WeekNumberPipe } from 'src/app/lib/pipes/week-number/week-number.pipe';
import { YCConfig } from 'src/app/lib/year-calendar-interfaces';
import { holidayList } from '../../holiday-list.constant';
@Component({
  selector: 'ycd-example-section',
  templateUrl: './example-section.component.html',
  styleUrls: ['./example-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleSectionComponent implements OnInit, OnChanges {

  @Input() year = '';
  @Input() prefrence = []

  ycConfig: YCConfig = {
    heatmapColor: '#FF5500',
    data: [],
    nextBtn: {
      text: 'Next',
      class: 'btn btn-dark',
    },
    prevBtn: {
      text: 'Previous',
      class: 'btn btn-dark',
    },
    todayBtn: {
      hide: false,
      class: 'btn btn-primary'
    },
    firstWeekMonth: {
      month: 0, // January
      week: 0 // use `null` for standard weeks and calculations
    },
    showWeekNumbers: false,
    weekNumbersColor: '#778CA2',
    dayClass: 'year-calendar-day',
    maxValue: 10 // let the component calculate the max value from all values,
  };

  selectedDates: any;

  prefrences: any = [new Date()];

  @Output() sendYearChanged = new EventEmitter();

  selectPrefrences() {
    this.selectedDates = {
      date: new Date('01/01/' + this.year),
      list: this.prefrences
    }
  }
  
  @Input() loadingData = false;
  @Input() calendarDate = new Date();
  weekNumberPipe = new WeekNumberPipe();
  constructor() { }

  ngOnInit() {
    this.selectedDates = {
      date: new Date('01/01/' + this.year),
      list: this.prefrences
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    if(!changes.prefrence.firstChange && changes.prefrence.currentValue) {
      this.prefrences = [];
    }

    if(!changes.prefrence.firstChange && changes.prefrence.currentValue.includes('Holiday')) {
      const list = [];
      if(holidayList[this.year] && holidayList[this.year].length > 0) {
        holidayList[this.year].forEach(date => {
          list.push(new Date(date))
        })
      }


      this.prefrences = [...this.prefrences, ...list];
      
    }

    if(!changes.prefrence.firstChange && changes.prefrence.currentValue.includes('All Monday')) {
      let mondays = [];
      for (let i = 1; i <= 12; i++) {
        mondays = [...mondays, ...this.mondaysInMonth(i, this.year)];
      }    
      this.prefrences = [...this.prefrences, ...mondays];
      
    }
    this.selectPrefrences();

  }

  mondaysInMonth(m,y) {
    let days = new Date(y,m,0).getDate();
    let mondays: any =  new Date(m +'/01/'+ y).getDay();
    if(mondays != 1){
      mondays = 9 - mondays;
    }
    mondays = [mondays];
    //console.log(mondays);
    for (let i = mondays[0] + 7; i <= days; i += 7) {
      mondays.push(i);
    }

    let mandaydates = [];
    mondays.forEach(date => {
      mandaydates.push(new Date(m + '/' + date + '/' + y))
    })

    return mandaydates;
  }

  yearChanged($event: any) {
    this.calendarDate = new Date($event, this.calendarDate.getMonth(), this.calendarDate.getDate());
    this.sendYearChanged.emit(this.calendarDate);
  }

  dayClicked($event: any) {
    console.log(this.weekNumberPipe.transform($event.day.date, this.ycConfig, this.calendarDate.getFullYear()));
  }

}
