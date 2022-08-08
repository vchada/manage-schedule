import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as moment from 'moment';
import { CommonDataService } from '../services/common-data.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  availableCalender = [];
  selectedDateList = [];
  calenderType = 'regular';
  form: FormGroup = new FormGroup({});
  @ViewChild('confirmationModal') confirmationModal: ElementRef;
  @ViewChild('closeConfirmationModal') closeConfirmationModal: ElementRef;
  @ViewChild('disbaleConfirmationModal') disbaleConfirmationModal: ElementRef;
  @ViewChild('closeDisableModal') closeDisableModal: ElementRef;
  @ViewChild('enableConfirmationModal') enableConfirmationModal: ElementRef;
  @ViewChild('closeEnableModal') closeEnableModal: ElementRef;
  isDisabled = false;

  years = [
    2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032
  ]
  dataSource = [];

  selectedYear = 2022;

  prefrenceList = []
  prefrenceListToInclude = [];
  prefrenceListToExclude = [];

  selectedPrefrence = []
  selectedPrefrenceList = [];

  selectedPrefrenceToExclude = [];
  selectedPrefrenceListToExclude = [];

  editSchedule = false;
  existingCalendarDetails: any;

  includeWeekends = new FormControl(false);

  dataSouceList = [
    {value: 'PPF', name: 'PPF'},
          {value: 'MISF', name: 'MISF'},
          {value: 'INT1', name: 'INT1'},
          {value: 'CTM_INT4', name: 'CTM_INT4'},
          {value: 'CTM_SERVER', name: 'CTM_SERVER'},
          {value: 'INT6', name: 'INT6'},
          {value: 'PRD2', name: 'PRD2'},
          {value: 'PRD4', name: 'PRD4'},
          {value: 'PRD6', name: 'PRD6'},
  ]

  constructor(private httpService: HttpService, private fb: FormBuilder, private router: Router, private commonDataService: CommonDataService) {
    this.form = fb.group({
      name: ['', [Validators.required]],
      displayName: [''],
      description: ['']
    })

    this.getAllExistingcalenderNames();
    if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras && this.router.getCurrentNavigation().extras.state) {

      // this is edit rule data coming from dashboard
      const stateData = this.router.getCurrentNavigation().extras.state;
      this.dataSource = stateData.dataSource ? stateData.dataSource.split(','): [];
      this.existingCalendarDetails = stateData;
      this.editSchedule = true;
      this.selectedYear = +stateData.year;
      this.isDisabled = stateData.isActive === 'ACTIVE' ? false: true;
      this.httpService.getHolidayList(stateData.year, this.includeWeekends.value).subscribe(res => {
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

        this.prefrenceListToInclude = [...this.prefrenceListToInclude.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)];
          this.prefrenceListToExclude = [...this.prefrenceList];

        this.prefrenceListToExclude = [...this.prefrenceListToExclude.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)];


          this.changePrefrence(stateData.rulesIncluded.split(','));
          this.changePrefrenceToExclude(stateData.rulesExcluded.split(','));

          this.form.controls.name.patchValue(stateData.name.toLowerCase());
          this.form.controls.displayName.patchValue(stateData.displayName);

          this.form.controls.displayName.setValidators(Validators.required);
          this.form.controls.description.patchValue(stateData.description);

          this.form.controls.name.disable();

          this.form.updateValueAndValidity();
        }
      }, err => {
        console.error(err);
      })




    } else {
      this.fetchHolidayList(this.selectedYear);
    }
   }

  ngOnInit(): void {
    this.includeWeekends.valueChanges.subscribe(val => {

      this.httpService.getHolidayList(this.selectedYear,val).subscribe(res => {
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

        this.prefrenceListToInclude = [...this.prefrenceListToInclude.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)];
          this.prefrenceListToExclude = [...this.prefrenceList];

        this.prefrenceListToExclude = [...this.prefrenceListToExclude.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)];


          this.changePrefrence(this.selectedPrefrence);
          this.changePrefrenceToExclude(this.selectedPrefrenceToExclude);

        }
      }, err => {
        console.error(err);
      })
    })
  }

  getActiveStatus(name) {
    return this.prefrenceList.find(item => item.name === name) ? true: false;
  }


  getAllExistingcalenderNames() {

    this.httpService.getAllExistingcalenderNames().subscribe((res: any) => {
      if (res) {
        this.availableCalender = res;
        this.availableCalender = this.availableCalender.filter(item => {
          if(this.existingCalendarDetails && this.existingCalendarDetails.name) {
            return ((item === this.existingCalendarDetails.name) || (item === this.existingCalendarDetails.displayName)) ? false: true;
          } else {
            return true;
          }
        })
      }
    }, err => {
      console.error(err);
    })

  }

  fetchHolidayList(selectedYear) {
    this.prefrenceList = [];
    this.prefrenceListToInclude = [];
    this.prefrenceListToExclude = [];
    this.httpService.getHolidayList(selectedYear, this.includeWeekends.value).subscribe(res => {
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

        this.prefrenceListToInclude = [...this.prefrenceListToInclude.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)];
        this.prefrenceListToExclude = [...this.prefrenceList];

        this.prefrenceListToExclude = [...this.prefrenceListToExclude.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)];
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
    // this.selectedPrefrence = [];
    // this.selectedPrefrenceList = [];

    // this.selectedPrefrenceToExclude = [];
    // this.selectedPrefrenceListToExclude = [];

    // this.isDisabled = false;
    // this.editSchedule = false;

    this.prefrenceList = [];
    this.prefrenceListToInclude = [];
    this.prefrenceListToExclude = [];
    this.httpService.getHolidayList(this.selectedYear, this.includeWeekends.value).subscribe(res => {
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
        this.prefrenceListToInclude = [...this.prefrenceListToInclude.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)];
        this.prefrenceListToExclude = [...this.prefrenceList];
        this.prefrenceListToExclude = [...this.prefrenceListToExclude.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)];


        this.changePrefrence(this.selectedPrefrence);
        this.changePrefrenceToExclude(this.selectedPrefrenceToExclude);
      }
    }, err => {
      console.error(err);
    })
    this.getAllExistingcalenderNames();
    this.commonDataService.setYearChange(this.selectedYear);
  }

  changePrefrence(prefrence) {
    this.selectedPrefrence = prefrence;
    this.selectedPrefrenceList = [];
    this.selectedPrefrence.forEach(item => {
      if(item && this.prefrenceList.find(val => val.name === item) && this.prefrenceList.find(val => val.name === item).dates) {
        this.selectedPrefrenceList = [...this.selectedPrefrenceList ,...(this.prefrenceList.find(val => val.name === item).dates)]
      }
    })

    this.prefrenceListToExclude = this.prefrenceList.filter(item => !prefrence.includes(item.name));

    this.prefrenceListToExclude = [...this.prefrenceListToExclude.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)];
  }

  changeDataSource(res) {
    this.dataSource = res;
  }

  changePrefrenceToExclude(prefrence) {
    this.selectedPrefrenceToExclude = prefrence;
    this.selectedPrefrenceListToExclude = [];
    this.selectedPrefrenceToExclude.forEach(item => {
      if(item && this.prefrenceList.find(val => val.name === item)) {
        this.selectedPrefrenceListToExclude = [...this.selectedPrefrenceListToExclude ,...(this.prefrenceList.find(val => val.name === item).dates)]
      }
    })

    this.prefrenceListToInclude = this.prefrenceList.filter(item => !prefrence.includes(item.name));

    this.prefrenceListToInclude = [...this.prefrenceListToInclude.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)];
  }

  sendYearChanged(year) {
    this.selectedYear = (new Date(year)).getFullYear();
    this.changeYear(this.selectedYear);
  }

  cancel() {
    this.selectedPrefrence = [];
    this.selectedPrefrenceList = [];

    this.selectedPrefrenceToExclude = [];
    this.selectedPrefrenceListToExclude = [];
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
    let isNameAlreadyExist = false;
        this.availableCalender.forEach(item => {
          if(!this.editSchedule) {
            if(item.toUpperCase() === this.form.controls.name.value.toUpperCase()) {
              isNameAlreadyExist = true;
            }
          } else {
            if(item.toUpperCase() === this.form.controls.displayName.value.toUpperCase()) {
              isNameAlreadyExist = true;
            }
          }
        })

        if(isNameAlreadyExist) {
          if(!this.editSchedule) {
            this.form.controls.name.setErrors({alreadyExist: true});
          } else {
            this.form.controls.displayName.setErrors({alreadyExist: true});
          }
        } else {
    this.httpService.getRuleIds().subscribe((ruleIds: any) => {
      if (ruleIds ) {
        const reqData = {
          name: this.form.controls.name.value,
          createdDateAndTime: null,
          createdUser: "User",
          lastModifiedUser: null,
          lastModifiedDateAndTime: null,
          isActive: 'ACTIVE',
          ruleIds: "",
          dataSource: this.dataSource.join(),
          year: this.selectedYear,
          displayName: this.editSchedule ? this.form.controls.displayName.value : this.form.controls.name.value,
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
              this.closeConfirmationModal.nativeElement.click();
              this.router.navigate(['dashboard']);
            }
          }, err => {
            console.error(err);
          })
        } else {
          this.httpService.updateCalendar(reqData).subscribe((res: any) => {
            if (res && res.message === 'CALENDAR UPDATED SUCCESSFULLY') {
              this.closeConfirmationModal.nativeElement.click();
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

  }

  enableRuleConfirm() {
    this.httpService.getRuleIds().subscribe((ruleIds: any) => {
      if (ruleIds ) {
        const reqData = {
          name: this.form.controls.name.value,
          createdDateAndTime: null,
          createdUser: "User",
          lastModifiedUser: null,
          lastModifiedDateAndTime: null,
          isActive: 'ACTIVE',
          ruleIds: "",
          year: this.selectedYear,
          displayName: this.editSchedule ? this.form.controls.displayName.value : this.form.controls.name.value,
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


        this.httpService.updateCalendar(reqData).subscribe((res: any) => {
          if (res && res.message === 'CALENDAR UPDATED SUCCESSFULLY') {
            this.closeEnableModal.nativeElement.click();
            this.router.navigate(['dashboard']);
          }
        }, err => {
          console.error(err);
        })
      }
    }, err => {
      console.error(err);
    })
  }


  disableRuleConfirm() {
    this.httpService.getRuleIds().subscribe((ruleIds: any) => {
      if (ruleIds ) {
        const reqData = {
          name: this.form.controls.name.value,
          createdDateAndTime: null,
          createdUser: "User",
          lastModifiedUser: null,
          lastModifiedDateAndTime: null,
          isActive: 'IN_ACTIVE',
          ruleIds: "",
          year: this.selectedYear,
          displayName: this.editSchedule ? this.form.controls.displayName.value : this.form.controls.name.value,
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


        this.httpService.updateCalendar(reqData).subscribe((res: any) => {
          if (res && res.message === 'CALENDAR UPDATED SUCCESSFULLY') {
            this.closeDisableModal.nativeElement.click();
            this.router.navigate(['dashboard']);
          }
        }, err => {
          console.error(err);
        })
      }
    }, err => {
      console.error(err);
    })
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

  convertToXML(jsonData) {
    jsonData = jsonData || [];
    var header = "<?xml version='1.0' encoding='UTF-8'?>\n" +
      "<!DOCTYPE DEFCAL SYSTEM \"defcal.dtd\">\n" +
      "<DEFCAL>\n";

    var xml = '';
    // let count = 0;
    // jsonData.forEach((item, index) => {

    var current = moment(new Date((this.selectedYear + 1) + "-01-01")).startOf('year').format('MM-DD-YYYY');
    var end = moment(new Date((this.selectedYear) + 1 + "-01-01")).endOf('year').format('MM-DD-YYYY');


    // this.httpService.getHolidayList(this.selectedYear, false).subscribe(res => {

      // count += 1;
      // if (res ) {
      //   debugger
      //   let prefrenceList = [];
      //   Object.keys(res).forEach(item => {

      //     const obj = {
      //       name: item,
      //       dates: []
      //     }

      //     res[item].split(',').forEach(val => {
      //       obj.dates.push(val + '-' + this.selectedYear)
      //     })

      //     prefrenceList.push(obj)
      //   })

      //   let rulesIncludedDates = [];
      //   item.rulesIncluded.split(',').forEach(x => {
      //     if(prefrenceList.find(y => y.name === x)) {
      //       rulesIncludedDates = [...rulesIncludedDates, ...prefrenceList.find(y => y.name === x).dates];
      //     }
      //   })

      //   let rulesExcludedDates = [];
      //   item.rulesExcluded.split(',').forEach(x => {
      //     if(prefrenceList.find(y => y.name === x)) {
      //       rulesExcludedDates = [...rulesExcludedDates, ...prefrenceList.find(y => y.name === x).dates];
      //     }
      //   })

      //   let ruleIds = rulesIncludedDates.filter(x => {
      //     return !rulesExcludedDates.includes(x)
      //   })

        var dayList = [];
        while (true) {
          dayList.push(this.selectedDateList.find(item => moment(item).format('MM-DD-YYYY') === current) ? 'Y' : 'N');

          current = moment(current).add(1, 'days').format('MM-DD-YYYY');
          if (current === end) break;
        }
        
        if(this.dataSource.length > 0) {
          this.dataSource.forEach(source => {
            xml += "<CALENDAR\nDATACENTER=\"" + source + "\"\n" +
            "NAME=\"" + 'null' + "\"\n" +
            "TYPE=\"Regular\">\n" +
            "<YEAR\nNAME=\"" + this.selectedYear + "\"\n" +
            "DAYS=\"" + dayList.join('') + "\"\n" +
            "DESCRIPTION=\"" + 'null' + "\"/>\n" +
            "</CALENDAR>\n";
          })
        } else {
          xml += "<CALENDAR\nDATACENTER=\"" + 'null' + "\"\n" +
          "NAME=\"" + 'null' + "\"\n" +
          "TYPE=\"Regular\">\n" +
          "<YEAR\nNAME=\"" + this.selectedYear + "\"\n" +
          "DAYS=\"" + dayList.join('') + "\"\n" +
          "DESCRIPTION=\"" + 'null' + "\"/>\n" +
          "</CALENDAR>\n";
        }
    
        // if(count === (jsonData.length)) {

          xml += "</DEFCAL>";

          xml = header + xml;

          this.printXML(xml);
        // }

      // }

    // }, err => {
      
    //   console.error(err);
    // })
  // });


    
  }

  printXML(xml) {
    //Download XML
    let link = document.createElement('a');
    link.href = "data:text/xml," + encodeURIComponent(xml);
    link.download = "defcal.xml";
    link.click();
  }

  generate() {
    if (this.selectedDateList.length === 0) {
      alert('Please select atleast 1 calender to generate the XML');
      return;
    }
    this.convertToXML(this.selectedDateList);
  }


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
