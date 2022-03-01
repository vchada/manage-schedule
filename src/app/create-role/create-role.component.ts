import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
export class CreateRoleComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      name: ['', [Validators.required]]
    })

  }

  selectedPrefrence = []

  ngOnInit(): void {
  }
    

  get f(){
    return this.form.controls;
  }

  
  years = [
    2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032
  ]

  selectedYear = 2022;

  monthList = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  selectedMonth = '';

  changeYear(year) {
    this.selectedYear = year;
    this.selectedMonth = '';
  }

  changeMonth(Month) {
    this.selectedMonth = Month;
  }

  sendYearChanged(year) {
    this.selectedYear = (new Date(year)).getFullYear();
  }

  cancel() {
    this.selectedMonth = '';
  }


}
