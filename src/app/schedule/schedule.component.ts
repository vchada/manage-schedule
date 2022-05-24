import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  prefrenceListToInclude = [];
  prefrenceListToExclude = [];

  selectedPrefrence = []
  selectedPrefrenceList = [];

  selectedPrefrenceToExclude = [];
  selectedPrefrenceListToExclude = [];

  editSchedule = false;

  constructor(private httpService: HttpService, private fb: FormBuilder, private router: Router) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      description: ['']
    })

    this.fetchHolidayList(this.selectedYear);
    if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras && this.router.getCurrentNavigation().extras.state) {

      // this is edit rule data coming from dashboard
      const stateData = this.router.getCurrentNavigation().extras.state;
      // stateData['rulesExcluded'] = 'test_update_20,MARCH_MONDAY';
      // stateData['rulesIncluded'] = 'test_update_19,test_update_18,r23';
      // stateData['year'] = 2022;

      this.editSchedule = true;

      this.httpService.getHolidayList(stateData.year).subscribe(res => {
        if (res ) {
          this.prefrenceList = [];
          this.prefrenceListToInclude = [];
          this.prefrenceListToExclude = [];
          Object.keys(res).forEach(item => {
  
            const obj = {
              name: item,
              dates: []
            }
  
            res[item].split(',').forEach(val => {
              obj.dates.push(val + '-' + this.selectedYear)
            })
  
            this.prefrenceList.push(obj)
          })
  
          this.prefrenceListToInclude = [...this.prefrenceList];
          this.prefrenceListToExclude = [...this.prefrenceList];


          this.changePrefrence(stateData.rulesIncluded.split(','));
          this.changePrefrenceToExclude(stateData.rulesExcluded.split(','));

          this.form.controls.name.patchValue(stateData.name);
          this.form.controls.description.patchValue(stateData.description);
          
          this.form.controls.name.disable();
        }
      }, err => {
        console.error(err);
      })


      

    } else {
    }
   }

  ngOnInit(): void {
    
  }

  fetchHolidayList(selectedYear) {
    this.prefrenceList = [];
    this.prefrenceListToInclude = [];
    this.prefrenceListToExclude = [];
    this.httpService.getHolidayList(selectedYear).subscribe(res => {
      if (res ) {
        Object.keys(res).forEach(item => {

          const obj = {
            name: item,
            dates: []
          }

          res[item].split(',').forEach(val => {
            obj.dates.push(val + '-' + this.selectedYear)
          })

          this.prefrenceList.push(obj)
        })

        this.prefrenceListToInclude = [...this.prefrenceList];
        this.prefrenceListToExclude = [...this.prefrenceList];
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

    this.prefrenceListToExclude = this.prefrenceList.filter(item => !prefrence.includes(item.name));
  }

  changePrefrenceToExclude(prefrence) {
    this.selectedPrefrenceToExclude = prefrence;
    this.selectedPrefrenceListToExclude = [];
    this.selectedPrefrenceToExclude.forEach(item => {
      if(item) {
        this.selectedPrefrenceListToExclude = [...this.selectedPrefrenceListToExclude ,...(this.prefrenceList.find(val => val.name === item).dates)]
      }
    })

    this.prefrenceListToInclude = this.prefrenceList.filter(item => !prefrence.includes(item.name));
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

    this.selectedPrefrenceList = [];
    this.selectedPrefrence.forEach(item => {
      if(item) {
        this.selectedPrefrenceList = [...this.selectedPrefrenceList ,...(this.prefrenceList.find(val => val.name === item).dates)]
      }
    })

    this.selectedPrefrenceListToExclude = [];
    this.selectedPrefrenceToExclude.forEach(item => {
      if(item) {
        this.selectedPrefrenceListToExclude = [...this.selectedPrefrenceListToExclude ,...(this.prefrenceList.find(val => val.name === item).dates)]
      }
    })
  }

  removeExcluded(prefrence) {
    this.selectedPrefrenceToExclude = this.selectedPrefrenceToExclude.filter(item => item !== prefrence);

    this.selectedPrefrenceList = [];
    this.selectedPrefrence.forEach(item => {
      if(item) {
        this.selectedPrefrenceList = [...this.selectedPrefrenceList ,...(this.prefrenceList.find(val => val.name === item).dates)]
      }
    })

    this.selectedPrefrenceListToExclude = [];
    this.selectedPrefrenceToExclude.forEach(item => {
      if(item) {
        this.selectedPrefrenceListToExclude = [...this.selectedPrefrenceListToExclude ,...(this.prefrenceList.find(val => val.name === item).dates)]
      }
    })
  }

  save() {
    this.httpService.getRuleIds().subscribe((ruleIds: any) => {
      if (ruleIds ) {
        const reqData = {
          name: this.form.controls.name.value,
          createdDateAndTime: null,
          createdUser: "Venkat Chada",
          lastModifiedUser: null,
          lastModifiedDateAndTime: null,
          active: true,
          ruleIds: "",
          year: this.selectedYear,
          rulesIncluded: this.createStr(this.selectedPrefrence),
          rulesExcluded: this.createStr(this.selectedPrefrenceToExclude)
        }
        this.selectedPrefrence.forEach(item => {
          if(reqData.ruleIds === '') {
            reqData.ruleIds = reqData.ruleIds + ruleIds[item]
          } else {
            reqData.ruleIds = reqData.ruleIds + ',' + ruleIds[item]
          }
        })
        reqData['description'] = this.form.value.description;

        if(!this.editSchedule) {
          this.httpService.saveCalendar(reqData).subscribe((res: any) => {
            if (res && res.message === 'CALENDER_PERSISTED_SUCCESSFULLY') {
              this.confirmationModal.nativeElement.click();
              this.router.navigate(['dashboard']);
            }
          }, err => {
            console.error(err);
          })
        } else {
          this.httpService.updateCalendar(reqData).subscribe((res: any) => {
            if (res && res.message === 'CALENDAR UPDATED SUCCESSFULLY') {
              this.confirmationModal.nativeElement.click();
              this.router.navigate(['dashboard']);
            }
          }, err => {
            console.error(err);
          })
        }
      }
    }, err => {
      console.error(err);
    })

  }

  disable() {

  }

  createStr(arr) {
    let returnStr = '';
    arr.forEach(item => {
      if(returnStr === '') {
        returnStr = item;
      } else {
        returnStr = returnStr + ',' + item;
      }
    })
    return returnStr;
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
