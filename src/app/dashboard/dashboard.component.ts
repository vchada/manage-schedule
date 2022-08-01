import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  calendarData = [];
  ruleData = [];

  
  selectedYear: any;
  years = [
    2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032
  ]

  selection = new SelectionModel<any>(true, []);



  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit() {
    this.httpService.getAllCalender('2022').subscribe((res: any) => {
      if (res) {
        this.calendarData = res;
      }
    }, err => {
      console.error(err);
    })

    this.httpService.getAllRules().subscribe((res: any) => {
      if (res) {
        const data = []
        Object.keys(res).forEach(item => {
          data.push(res[item][0]);
        })
        this.ruleData = data;
      }
    }, err => {
      console.error(err);
    })

  }

  changeYear(year) {

  }

  convertToXML(jsonData) {
    jsonData = jsonData || [];
    var header = "<?xml version='1.0' encoding='UTF-8'?>\n" +
      "<!DOCTYPE DEFCAL SYSTEM \"defcal.dtd\">\n" +
      "<DEFCAL>\n";

    var xml = '';
    let count = 0;
    jsonData.forEach((item, index) => {

    var current = moment(new Date((this.selectedYear + 1) + "-01-01")).startOf('year').format('MM-DD-YYYY');
    var end = moment(new Date(parseInt((this.selectedYear)) + 1 + "-01-01")).endOf('year').format('MM-DD-YYYY');


    this.httpService.getHolidayList(this.selectedYear, false).subscribe(res => {

      count += 1;
      if (res ) {
        debugger
        let prefrenceList = [];
        Object.keys(res).forEach(item => {

          const obj = {
            name: item,
            dates: []
          }

          res[item].split(',').forEach(val => {
            obj.dates.push(val + '-' + this.selectedYear)
          })

          prefrenceList.push(obj)
        })

        let rulesIncludedDates = [];
        item.rulesIncluded.split(',').forEach(x => {
          if(prefrenceList.find(y => y.name === x)) {
            rulesIncludedDates = [...rulesIncludedDates, ...prefrenceList.find(y => y.name === x).dates];
          }
        })

        let rulesExcludedDates = [];
        item.rulesExcluded.split(',').forEach(x => {
          if(prefrenceList.find(y => y.name === x)) {
            rulesExcludedDates = [...rulesExcludedDates, ...prefrenceList.find(y => y.name === x).dates];
          }
        })

        let ruleIds = rulesIncludedDates.filter(x => {
          return !rulesExcludedDates.includes(x)
        })

        var dayList = [];
        while (true) {
          dayList.push(ruleIds.includes(current) ? 'Y' : 'N');
          current = moment(current).add(1, 'days').format('MM-DD-YYYY');
          if (current === end) break;
        }
        

        xml += "<CALENDAR\nDATACENTER=\"" + item.dataSource + "\"\n" +
        "NAME=\"" + item.displayName + "\"\n" +
        "TYPE=\"Regular\">\n" +
        "<YEAR\nNAME=\"" + this.selectedYear + "\"\n" +
        "DAYS=\"" + dayList.join('') + "\"\n" +
        "DESCRIPTION=\"" + item.description + "\"/>\n" +
        "</CALENDAR>\n";
    
        if(count === (jsonData.length)) {

          xml += "</DEFCAL>";

          xml = header + xml;

          debugger;
          this.printXML(xml);
        }

      }

    }, err => {
      
      console.error(err);
    })
  });


    
  }

  printXML(xml) {
    //Download XML
    let link = document.createElement('a');
    link.href = "data:text/xml," + encodeURIComponent(xml);
    link.download = "defcal.xml";
    link.click();
  }

  generate() {
    if (this.selection.selected.length === 0) {
      alert('Please select atleast 1 calender to generate the XML');
      return;
    }
    this.convertToXML(this.selection.selected);
  }

  selectionChange(evt) {
    this.selection = evt; 
  }

}
