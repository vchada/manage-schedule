import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  selectedDateList = [];

  constructor() { }

  ngOnInit(): void {
  }

  years = [
    2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032
  ]

  selectedYear = 2022;

  prefrenceList = [
    'Holiday',
    'All Monday'
  ]

  selectedPrefrence = []

  dateSelected(dates) {
    this.selectedDateList = dates;
  }

  changeYear(year) {
    this.selectedYear = year;
    this.selectedPrefrence = [];
  }

  changePrefrence(prefrence) {
    this.selectedPrefrence = prefrence;
  }

  sendYearChanged(year) {
    this.selectedYear = (new Date(year)).getFullYear();
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
