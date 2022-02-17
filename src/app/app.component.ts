import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  years = [
    2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032
  ]

  selectedYear = 2022;

  prefrenceList = [
    'Holiday', 'All Monday'
  ]

  selectedPrefrence = []

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
}
