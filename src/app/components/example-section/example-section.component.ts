import { Component, OnInit, EventEmitter, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, Output } from '@angular/core';
import { WeekNumberPipe } from 'src/app/lib/pipes/week-number/week-number.pipe';
import { YCConfig } from 'src/app/lib/year-calendar-interfaces';

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
      const holidays = [new Date('01/01/'+ this.year), new Date('02/01/'+ this.year), new Date('03/01/'+ this.year), new Date('04/02/'+ this.year)]
      this.prefrences = [...this.prefrences, ...holidays];
      this.selectPrefrences();
    }

    if(!changes.prefrence.firstChange && changes.prefrence.currentValue.includes('All Monday')) {
      
      const mondays = [
        new Date('01/03/'+ this.year), 
        new Date('01/10/'+ this.year), 
        new Date('01/17/'+ this.year), 
        new Date('01/24/'+ this.year), 
        new Date('01/31/'+ this.year),

        new Date('02/07/'+ this.year), 
        new Date('02/14/'+ this.year), 
        new Date('02/21/'+ this.year), 
        new Date('02/28/'+ this.year),

        new Date('03/07/'+ this.year), 
        new Date('03/14/'+ this.year), 
        new Date('03/21/'+ this.year), 
        new Date('03/28/'+ this.year),

        new Date('04/04/'+ this.year), 
        new Date('04/11/'+ this.year), 
        new Date('04/18/'+ this.year), 
        new Date('04/25/'+ this.year)
      
      ]
      this.prefrences = [...this.prefrences, ...mondays];
      this.selectPrefrences();
    }
  }

  yearChanged($event: any) {
    this.calendarDate = new Date($event, this.calendarDate.getMonth(), this.calendarDate.getDate());
    this.sendYearChanged.emit(this.calendarDate);
  }

  dayClicked($event: any) {
    console.log(this.weekNumberPipe.transform($event.day.date, this.ycConfig, this.calendarDate.getFullYear()));
  }

}
