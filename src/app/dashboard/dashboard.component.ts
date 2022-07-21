import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  displayedColumns = ["select", "name", "isActive", "rulesIncluded", "rulesExcluded", "description", "createdDateAndTime", "createdUser", "lastModifiedDateAndTime", "lastModifiedUser"];
  dataSource = new MatTableDataSource<any>();
  @ViewChild('matSortCalender') matSortCalender: MatSort;
  calenderEntity = {
    displayName: '',
    isActive: '',
    rulesIncluded: '',
    rulesExcluded: '',
    description: '',
    createdDateAndTime: '',
    createdUser: '',
    lastModifiedDateAndTime: '',
    lastModifiedUser: '',
  }

  displayedRuleColumns = ["holidayType", "isActive", "description", "createdDateAndTime", "createdUser", "lastModifiedDateAndTime", "lastModifiedUser"];
  ruleDataSource = new MatTableDataSource<any>();
  @ViewChild('matSortRules') matSortRules: MatSort;
  rulesEntity = {
    displayName: '',
    isActive: '',
    description: '',
    createdDateAndTime: '',
    createdUser: '',
    lastModifiedDateAndTime: '',
    lastModifiedUser: ''
  }
  selectedYear: any;
  years = [
    2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032
  ]

  selection = new SelectionModel<any>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isRowSelected(row) {
    if (this.selection && this.selection.selected && this.selection.selected.length > 0) {
      return this.selection.selected.find(item => item.id === row.id) ? true : false;
    } else {
      return false;
    }
  }


  constructor(private httpService: HttpService, private router: Router) { }

  ngOnInit() {
    this.httpService.getAllCalender('2022').subscribe((res: any) => {
      if (res) {
        this.dataSource.data = res;
        this.dataSource.sort = this.matSortCalender;
      }
    }, err => {
      console.error(err);
    })

    this.httpService.getAllRules().subscribe((res: any) => {
      if (res) {
        Object.keys(res).forEach(item => {
          this.ruleDataSource.data.push(res[item][0]);
        })
        this.ruleDataSource.sort = this.matSortRules;
      }
    }, err => {
      console.error(err);
    })

  }

  changeYear(year) {

  }

  goToDashboard(row) {
    this.router.navigate(['schedule'], { state: row });
  }

  convertToXML(jsonData) {
    jsonData = jsonData || [];
    var header = "<?xml version='1.0' encoding='UTF-8'?>\n" +
      "<!DOCTYPE DEFCAL SYSTEM \"defcal.dtd\">\n" +
      "<DEFCAL>\n";
    var xml = jsonData.reduce(function (data, item) {
      data += "<CALENDAR\nDATACENTER=\"DATACENTER\"\n" +
        "NAME=\"" + item.rulesIncluded.toUpperCase().replace(/_/g, '') + "\"\n" +
        "TYPE=\"Regular\">\n" +
        "<YEAR\nNAME=\"" + item.year + "\"\n" +
        "DAYS=\"" + DashboardComponent.getDays(item) + "\"\n" +
        "DESCRIPTION=\"" + item.name + "\"/>\n" +
        "</CALENDAR>\n";
      return data;
    }, header);

    xml += "</DEFCAL>";

    //Download XML
    let link = document.createElement('a');
    link.href = "data:text/xml," + encodeURIComponent(xml);
    link.download = "defcal.xml";
    link.click();
  }

  static getDays(item) {
    var current = new Date(item.year + "-01-01").getTime();
    var end = new Date(parseInt(item.year) + 1 + "-01-01").getTime();
    var availableList = item.ruleIds.split(",").map(function (day) {
      return new Date(item.year + "-" + day).getTime();
    });
    var dayList = [];
    while (true) {
      dayList.push(availableList.indexOf(current) > -1 ? 'Y' : 'N');
      current += 24 * 3600 * 1000;
      if (current === end) break;
    }
    return dayList.join('');
  }

  printXML() {
    if (this.selection.selected.length === 0) {
      alert('Please select atleast 1 calender to generate the XML');
      return;
    }
    this.convertToXML(this.selection.selected);
  }


  generate() {

    this.printXML();
  }

  goToCreateRule(row) {
    this.httpService.getRuleDetails(row.holidayType).subscribe((res: any) => {
      if (res) {

        this.router.navigate(['create-rule'], { state: res });
      }
    }, err => {
      console.error(err);
    })
  }

}