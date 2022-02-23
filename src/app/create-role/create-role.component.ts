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

  ngOnInit(): void {
  }
    

  get f(){
    return this.form.controls;
  }

  
  years = [
    2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032
  ]

  selectedYear = 2022;

  prefrenceList = [
    'Holiday', 
    'All Monday'
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

  cancel() {
    this.selectedPrefrence = [];
  }

  remove(prefrence) {
    this.selectedPrefrence = this.selectedPrefrence.filter(item => item !== prefrence);
  }

}
