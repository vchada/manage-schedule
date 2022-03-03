import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as moment from 'moment';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  selectedDateList = [];
  form: FormGroup = new FormGroup({});
  @ViewChild('confirmationModal') confirmationModal: ElementRef;

  years = [
    2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032
  ]

  selectedYear = 2022;

  prefrenceList = []

  selectedPrefrence = []
  selectedPrefrenceList = [];
  constructor(private httpService: HttpService, private fb: FormBuilder) {
    this.form = fb.group({
      name: ['', [Validators.required]]
    })
   }

  ngOnInit(): void {
    this.fetchHolidayList(this.selectedYear);
  }

  fetchHolidayList(selectedYear) {
    this.prefrenceList = [];
    this.httpService.getHolidayList(selectedYear).subscribe(res => {
      if (res ) {
        Object.keys(res).forEach(item => {
          this.prefrenceList.push({
            name: item,
            dates: res[item].split(',')
          })
        })
      }
    }, err => {
      console.error(err);
    })
  }

  dateSelected(dates) {
    this.selectedDateList = dates;
  }

  changeYear(year) {
    this.selectedYear = year;
    this.selectedPrefrence = [];
    this.selectedPrefrenceList = [];
    this.fetchHolidayList(this.selectedYear);
  }

  changePrefrence(prefrence) {
    this.selectedPrefrence = prefrence;
    this.selectedPrefrenceList = [];
    this.selectedPrefrence.forEach(item => {
      if(item) {
        this.selectedPrefrenceList = [...this.selectedPrefrenceList ,...(this.prefrenceList.find(val => val.name === item).dates)]
      }
    })

  }

  sendYearChanged(year) {
    this.selectedYear = (new Date(year)).getFullYear();
    this.fetchHolidayList(this.selectedYear);
    this.selectedPrefrence = [];
  }

  cancel() {
    this.selectedPrefrence = [];
  }

  remove(prefrence) {
    this.selectedPrefrence = this.selectedPrefrence.filter(item => item !== prefrence);
  }

  save() {
    // let allDates = this.getDateArray(this.selectedYear);
    // this.selectedDateList;

    // let dateToSumbit = [];

    // allDates.forEach(date => {
    //   if(this.selectedDateList.find(item => moment(item).format('L') === moment(date).format('L'))) {
    //     const obj = {};
    //     obj[moment(date).format("L")] = 'Y';
    //     dateToSumbit.push(obj)
    //   } else {
    //     const obj = {};
    //     obj[moment(date).format("L")] = 'N';
    //     dateToSumbit.push(obj)
    //   }
    // })
    this.httpService.getRuleIds().subscribe((ruleIds: any) => {
      if (ruleIds ) {
        
        const reqData = {
          name: this.form.value.name,
          createdDateAndTime: null,
          createdUser: "Venkat Chada",
          lastModifiedUser: null,
          lastModifiedDateAndTime: null,
          active: true,
          ruleIds: ""
        }
        this.selectedPrefrence.forEach(item => {
          if(reqData.ruleIds === '') {
            reqData.ruleIds = reqData.ruleIds + ruleIds[item]
          } else {
            reqData.ruleIds = reqData.ruleIds + ',' + ruleIds[item]
          }
        })
        this.httpService.saveCalendar(reqData).subscribe((res: any) => {
          if (res && res.message === 'CALENDER_PERSISTED_SUCCESSFULLY') {
            this.confirmationModal.nativeElement.click();
          }
        }, err => {
          console.error(err);
        })
      }
    }, err => {
      console.error(err);
    })

  }

  generate() { }


  getDateArray(year) {


    let startDate = new Date(year + "-01-01"); //YYYY-MM-DD
    let endDate = new Date(year + "-12-31"); //YYYY-MM-DD 
    let arr = new Array();
    let dt = new Date(startDate);
    while (dt <= endDate) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }

}
