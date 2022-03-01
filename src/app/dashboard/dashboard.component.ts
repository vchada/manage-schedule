import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  selectedDateList = [];

  years = [
    2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032
  ]

  selectedYear = 2022;

  prefrenceList = []

  selectedPrefrence = []
  selectedPrefrenceList = [];
  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.fetchHolidayList(this.selectedYear);
  }

  fetchHolidayList(selectedYear) {
    this.httpService.getHolidayList(selectedYear).subscribe(res => {
      if (res ) {
        Object.keys(res).forEach(item => {
          this.prefrenceList.push({
            name: item,
            dates: [res[item]]
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
    let allDates = this.getDateArray(this.selectedYear);
    this.selectedDateList;

    let dateToSumbit = [];

    allDates.forEach(date => {
      if(this.selectedDateList.find(item => moment(item).format('L') === moment(date).format('L'))) {
        const obj = {};
        obj[moment(date).format("L")] = 'Y';
        dateToSumbit.push(obj)
      } else {
        const obj = {};
        obj[moment(date).format("L")] = 'N';
        dateToSumbit.push(obj)
      }
    })

    // {
    //   year: 2022,
    //   dates: dateToSumbit,
    //   rule: ['','','']
    // }

    debugger;
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
