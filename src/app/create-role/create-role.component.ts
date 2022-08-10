import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CommonDataService } from '../services/common-data.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
export class CreateRoleComponent implements OnInit {

  @ViewChild('confirmationModal') confirmationModal: ElementRef;
  @ViewChild('closeConfirmationModal') closeConfirmationModal: ElementRef;
  @ViewChild('disbaleConfirmationModal') disbaleConfirmationModal: ElementRef;
  @ViewChild('closeDisableModal') closeDisableModal: ElementRef;
  @ViewChild('enableConfirmationModal') enableConfirmationModal: ElementRef;
  @ViewChild('closeEnableModal') closeEnableModal: ElementRef;
  
  isDisabled = false;

  availableRules = [];

  form: FormGroup = new FormGroup({});
  selectedPrefrence = []
  selectedDateList = [];
  editRule = false;

  years = [
    2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032
  ]
  selectedYear = 2022;
  monthList = [
    { display: 'January', value: 1 },
    { display: 'February', value: 2 },
    { display: 'March', value: 3 },
    { display: 'April', value: 4 },
    { display: 'May', value: 5 },
    { display: 'June', value: 6 },
    { display: 'July', value: 7 },
    { display: 'August', value: 8 },
    { display: 'September', value: 9 },
    { display: 'October', value: 10 },
    { display: 'November', value: 11 },
    { display: 'December', value: 12 }
  ]
  selectedMonth = null;
  @ViewChild('monthSelect') monthSelect: MatSelect;
  allMonthSelected=false;

  dateList = [];
  selectedDate = null;
  @ViewChild('weekSelect') weekSelect: MatSelect;
  allWeekSelected=false;

  weekList = [1, 2, 3, 4, 5];
  selectedWeek = null;
  @ViewChild('daySelect') daySelect: MatSelect;
  allDaySelected=false;

  dayList = [
    { display: 'Monday', value: 1 },
    { display: 'Tuesday', value: 2 },
    { display: 'Wednesday', value: 3 },
    { display: 'Thursday', value: 4 },
    { display: 'Friday', value: 5 },
    { display: 'Saturday', value: 6 },
    { display: 'Sunday', value: 7 },
  ];
  selectedDay = null;

  flexibleDates = false;
  existingRuleDetails: any;

  afterBeforeDaySelection: string;
  afterBeforeDay: any[] = [{display: 'Day before', value: 'DAY_BEFORE'}, {display: 'Day after', value: 'DAY_AFTER'}];

  currentCheckedValue = null;


  prefrenceListToInclude = [];
  selectedIncludedPrefrence = [];

  constructor(private fb: FormBuilder, private httpService: HttpService, private router: Router, private ren: Renderer2, private commonDataService: CommonDataService) {
    this.form = fb.group({
      name: ['', [Validators.required, ]],
      displayName: [''],
      description: ['']
    })
    // This will trigger in case of edit rule
    if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras && this.router.getCurrentNavigation().extras.state) {
      const stateData = this.router.getCurrentNavigation().extras.state;
      this.existingRuleDetails = stateData;
      this.flexibleDates = stateData[0].customDays ? true : false;
      this.selectedYear = +stateData[0].year;
      this.isDisabled = stateData[0].isActive === 'ACTIVE' ? false: true;
      this.getAllExistingRuleNames();

      this.prefrenceListToInclude = [];
      this.httpService.getHolidayList(this.selectedYear).subscribe(res => {
        if (res ) {
          Object.keys(res).forEach(item => {
            if(item !== stateData[0].holidayType) {

            const obj = {
              name: item,
              dates: []
            }

            res[item].split(',').forEach(val => {
              obj.dates.push(val + '-' + this.selectedYear)
            })

            this.prefrenceListToInclude.push(obj)
          }

        this.prefrenceListToInclude = [...this.prefrenceListToInclude.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)];
          })

      // this.getAvailableRules(this.selectedYear);
      if (this.flexibleDates) {
        this.selectedMonth = null;
        this.selectedDate = null;
        this.selectedWeek = null;
        this.selectedDay = null;

        if (stateData[0].customDays) {
          let dates = []
          stateData[0].customDays.split(',').forEach(item => {
            dates.push(moment(item + '-' + this.selectedYear).format('L'));
          })
          this.selectedPrefrence = [...this.selectedPrefrence, ...dates];
        }

      } else {
        let month = [];
        let week = [];
        let day = [];
        stateData.forEach(val => {
          if(!month.includes( this.monthList.find(item => item.display.toUpperCase() == val.month).value )) {
            month.push(this.monthList.find(item => item.display.toUpperCase() == val.month).value);
          }

          if(!week.includes( val.weekOfTheMonth )) {
            week.push(val.weekOfTheMonth);
          }

          if(!day.includes( this.dayList.find(item => item.display.toUpperCase() == val.dayOfTheWeek).value )) {
            day.push(this.dayList.find(item => item.display.toUpperCase() == val.dayOfTheWeek).value);
          }
        })

        if(month) {
          // this.changeMonth(this.monthList.find(item => item.display.toUpperCase() == stateData.month).value);
          this.changeMonth(month);
        }

        this.changeWeek(week);
  
        if(day) {
          this.changeDay(day);
        }

        this.selectedPrefrence = [];
        this.afterBeforeDaySelection = stateData[0].lastModifiedUser;
        this.apply();
      }

      this.form.patchValue({
        name: stateData[0].holidayType,
        displayName: stateData[0].displayName,
        description: stateData[0].description
      })
      if(stateData[0].rulesIncluded !== '') {
        this.selectedIncludedPrefrence = stateData[0].rulesIncluded.split(',');
        stateData[0].rulesIncluded.split(',').forEach(item => {
          if(item) {
            this.selectedPrefrence = [...this.selectedPrefrence ,...(this.prefrenceListToInclude.find(val => val.name === item).dates)]
          }
        })
      }

      this.editRule = true;
      this.form.controls.displayName.setValidators(Validators.required);
      this.form.controls.name.disable();
      this.form.updateValueAndValidity();

    }
  }, err => {
    console.error(err);
  })

    } else {
      this.editRule = false;
      // this.getAvailableRules(this.selectedYear);
    this.fetchHolidayList(this.selectedYear);
    }
    this.getAllExistingRuleNames();
  }

  getAllExistingRuleNames() {
    this.httpService.getAllExistingRuleNames().subscribe((res: any) => {
      if (res) {
        this.availableRules = res;
        this.availableRules = this.availableRules.filter(item => {
          if(this.existingRuleDetails && this.existingRuleDetails[0]) {
            return ((item === this.existingRuleDetails[0].holidayType) || (item === this.existingRuleDetails[0].displayName)) ? false: true;
          } else {
            return true;
          }
        })
      }
    }, err => {
      console.error(err);
    })
  }

  changeFlexibledate(evt) {
    this.flexibleDates = evt;
    if (this.flexibleDates) {
      this.selectedMonth = null;
      this.selectedDate = null;
      this.selectedWeek = null;
      this.selectedDay = null;
      // this.selectedPrefrence = [];
      this.afterBeforeDaySelection = null;
      this.selectedPrefrence = [];
      this.selectedIncludedPrefrence.forEach(item => {
        if(item) {
          this.selectedPrefrence = [...this.selectedPrefrence ,...(this.prefrenceListToInclude.find(val => val.name === item).dates)]
        }
      })

    } else {
      // this.selectedPrefrence = [];
      this.selectedPrefrence = [];
      this.selectedIncludedPrefrence.forEach(item => {
        if(item) {
          this.selectedPrefrence = [...this.selectedPrefrence ,...(this.prefrenceListToInclude.find(val => val.name === item).dates)]
        }
      })
    }
    // this.selectedDateList = [];
  }


  ngOnInit(): void {

  }

  fetchHolidayList(selectedYear) {
    this.prefrenceListToInclude = [];
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

          this.prefrenceListToInclude.push(obj)
        })

        this.prefrenceListToInclude = [...this.prefrenceListToInclude.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)];
      }
    }, err => {
      console.error(err);
    })
  }


  changePrefrence(prefrence) {
    if(prefrence.length > this.selectedIncludedPrefrence.length) {
      let addedPreference = '';
      prefrence.forEach(val => {
        if(!this.selectedIncludedPrefrence.includes(val)) {
          addedPreference = val;
        }
      })
      const addDates = this.prefrenceListToInclude.find(val => val.name === addedPreference).dates;
      this.selectedPrefrence = [...this.selectedPrefrence, ...this.selectedDateList, ...addDates];
    } else {
      let removedPreference = '';
      this.selectedIncludedPrefrence.forEach(val => {
        if(!prefrence.includes(val)) {
          removedPreference = val;
        }
      })

      const removeDates = this.prefrenceListToInclude.find(val => val.name === removedPreference)? this.prefrenceListToInclude.find(val => val.name === removedPreference).dates: [];
      this.selectedPrefrence = this.selectedPrefrence.filter(item => {
        return !removeDates.includes(item);
      })
    }



    this.selectedIncludedPrefrence = prefrence;
    // this.selectedPrefrence = [];
    // this.selectedIncludedPrefrence.forEach(item => {
    //   if(item) {
    //     this.selectedPrefrence = [...this.selectedPrefrence ,...(this.prefrenceListToInclude.find(val => val.name === item).dates)]
    //   }
    // })
  }

  remove(prefrence) {
    this.selectedIncludedPrefrence = this.selectedIncludedPrefrence.filter(item => item !== prefrence);

    // this.selectedPrefrence = [];
    // this.selectedIncludedPrefrence.forEach(item => {
    //   if(item) {
    //     this.selectedPrefrence = [...this.selectedPrefrence ,...(this.prefrenceListToInclude.find(val => val.name === item).dates)]
    //   }
    // })

    const preDates = this.prefrenceListToInclude.find(val => val.name === prefrence).dates;

    const removeDates = [];
    preDates.forEach(item => {
      removeDates.push(moment(item).format('L'))
    })
    this.selectedPrefrence = this.selectedPrefrence.filter(item => {
      return !removeDates.includes(moment(item).format('L'));
    })


  }

  get f() {
    return this.form.controls;
  }

  changeYear(year) {
    let prevYear = this.selectedYear;
    let prevPrefrence = this.selectedPrefrence;
    this.selectedYear = year;
    // this.flexibleDates = false;
    // this.selectedMonth = null;
    // this.selectedDate = null;
    // this.selectedWeek = null;
    // this.selectedDay = null;
    // this.dateList = [];
    // this.selectedIncludedPrefrence = [];
    // this.selectedPrefrence = [];
    
    this.commonDataService.setYearChange(this.selectedYear);
    const prevPrefrenceListToInclude = [...this.prefrenceListToInclude];

    this.prefrenceListToInclude = [];
    this.httpService.getHolidayList(this.selectedYear).subscribe(res => {
      if (res ) {
        Object.keys(res).forEach(item => {

          const obj = {
            name: item,
            dates: []
          }

          res[item].split(',').forEach(val => {
            obj.dates.push(val + '-' + this.selectedYear)
          })

          this.prefrenceListToInclude.push(obj)
        })

        this.prefrenceListToInclude = [...this.prefrenceListToInclude.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)];

        if ((!this.flexibleDates && !this.selectedMonth)) {
          this.selectedPrefrence = [];
          let dates = [];
          this.selectedIncludedPrefrence.forEach(item => {
            if(this.prefrenceListToInclude.find(val => val.name === item)?.dates) {
              dates = [...dates, ...(this.prefrenceListToInclude.find(val => val.name === item)?.dates)];
            }            
          })
          this.selectedPrefrence = [...this.selectedPrefrence, ...dates];
        } else if (this.flexibleDates) {
          let allCustomDates = [...this.selectedDateList];
          this.selectedIncludedPrefrence.forEach(item => {
            if(prevPrefrenceListToInclude.find(val => val.name === item)) {
              prevPrefrenceListToInclude.find(val => val.name === item).dates.forEach(a => {
                allCustomDates = allCustomDates.filter(b => {
                  let date1 = moment(b).format('L');
                  let date2 = moment(a).format('L');
                  
                  return date1 != date2;
                })
              })
            }
          })

          this.selectedPrefrence = [];
          const newCustomDates = [];
          allCustomDates.forEach(item => {
            const date = moment(item).format('L');
            const newDate = date.slice(0, date.length -4) + this.selectedYear;
            newCustomDates.push(newDate);
          })
          this.selectedDateList = [...newCustomDates];

          this.selectedPrefrence = [...this.selectedPrefrence, ...newCustomDates];

          let dates = [];
          this.selectedIncludedPrefrence.forEach(item => {
            if(this.prefrenceListToInclude.find(val => val.name === item)?.dates) {
              dates = [...dates, ...(this.prefrenceListToInclude.find(val => val.name === item)?.dates)];
            }            
          })
          this.selectedPrefrence = [...this.selectedPrefrence, ...dates];
        } else if (!this.flexibleDates && this.selectedMonth && this.selectedWeek && this.selectedDay) {

          this.selectedPrefrence = [];

          const req = [];

    this.selectedMonth.forEach(month => {
      this.selectedWeek.forEach(week => {
        this.selectedDay.forEach(day => {
          req.push({
            year: this.selectedYear,
            dayOfTheMonth: 0,      
            dayOfTheWeek: day,
            month: month,
            weekOfTheMonth: week
          })
        })
      })
    })
    let newdates = [];
    this.httpService.getSelectedDate(req).subscribe((res: any) => {
      if (res && res.length > 0) {

        if(res.length === 1) {
          if(this.afterBeforeDaySelection === 'DAY_BEFORE') {
            // this.selectedPrefrence = [];
            res.forEach(item => {
              newdates.push(moment(item).subtract(1, "days").format('L'));
            })
          } 
  
          if(this.afterBeforeDaySelection === 'DAY_AFTER') {
            // this.selectedPrefrence = [];
            res.forEach(item => {
              newdates.push(moment(item).add(1, "days").format('L'));
            })
          }
  
          if(!this.afterBeforeDaySelection) {
            // this.selectedPrefrence = [];
            res.forEach(item => {
              newdates.push(moment(item).format('L'));
            })
          }
        } else {

          // this.selectedPrefrence = [];
          res.forEach(item => {
            newdates.push(moment(item).format('L'));
          })
        }
        this.selectedPrefrence = [...this.selectedPrefrence, ...newdates];


        let dates = [];
        this.selectedIncludedPrefrence.forEach(item => {
          if(this.prefrenceListToInclude.find(val => val.name === item)?.dates) {
            dates = [...dates, ...(this.prefrenceListToInclude.find(val => val.name === item)?.dates)];
          }            
        })
        this.selectedPrefrence = [...this.selectedPrefrence, ...dates];
      }
    }, err => {
      console.error(err);
    })

        
        }
      }
    }, err => {
      console.error(err);
    })

    // this.editRule = false;
    // this.isDisabled = false;
    // this.existingRuleDetails = null;
    // this.getAllExistingRuleNames();
    // this.getAvailableRules(this.selectedYear);
  }

  changeMonth(Month) {
    this.selectedMonth = Month;
    this.selectedDate = null;
    this.selectedWeek = null;
    this.selectedDay = null;
    // const dates = this.getDateArray(this.selectedYear, this.selectedMonth);
    // dates.forEach(date => {
    //   this.dateList.push(moment(date).format('L'));
    // })


    let status = true;
    if(this.monthSelect) {
      this.monthSelect.options.forEach((item: MatOption) => {
        if (!item.selected) {
          status = false;
        }
      });
    } else {
      status = Month.length === this.monthList.length;
    }
    this.allMonthSelected = status;
  }

  toggleAllMonthSelection() {
    if (this.allMonthSelected) {
      this.monthSelect.options.forEach((item: MatOption) => item.select());
    } else {
      this.monthSelect.options.forEach((item: MatOption) => item.deselect());
    }
  }

  changeDate(date) {
    this.selectedDate = date;
    this.selectedWeek = null;
    this.selectedDay = null;
  }

  changeWeek(week) {
    this.selectedWeek = (week && week.length > 0) ? week: null;
    this.selectedDate = null;
    let status = true;
    if(this.weekSelect) {
      this.weekSelect.options.forEach((item: MatOption) => {
        if (!item.selected) {
          status = false;
        }
      });

    } else {
      status = week.length === this.weekList.length;
    }
    this.allWeekSelected = status;
  }

  toggleAllWeekSelection() {
    if (this.allWeekSelected) {
      this.weekSelect.options.forEach((item: MatOption) => item.select());
    } else {
      this.weekSelect.options.forEach((item: MatOption) => item.deselect());
    }
  }

  changeDay(day) {
    this.selectedDay = (day && day.length > 0)? day: null;
    this.selectedDate = null;
    let status = true;
    if(this.daySelect) {
      this.daySelect.options.forEach((item: MatOption) => {
        if (!item.selected) {
          status = false;
        }
      });

    } else {
      status = day.length === this.dayList.length;
    }
    this.allDaySelected = status;
  }

  toggleAllDaySelection() {
    if (this.allDaySelected) {
      this.daySelect.options.forEach((item: MatOption) => item.select());
    } else {
      this.daySelect.options.forEach((item: MatOption) => item.deselect());
    }
  }

  reset() {
    this.cancel();
  }

  cancel() {
    // this.selectedYear = 2022;
    this.flexibleDates = false;
    this.selectedMonth = null;
    this.selectedDate = null;
    this.selectedWeek = null;
    this.selectedDay = null;
    this.dateList = [];
    this.commonDataService.setYearChange(this.selectedYear);
    this.selectedIncludedPrefrence = [];
    this.afterBeforeDaySelection = null;
    this.selectedPrefrence = [];
  }

  apply() {

    const req = [];

    this.selectedMonth.forEach(month => {
      this.selectedWeek.forEach(week => {
        this.selectedDay.forEach(day => {
          req.push({
            year: this.selectedYear,
            dayOfTheMonth: 0,      
            dayOfTheWeek: day,
            month: month,
            weekOfTheMonth: week
          })
        })
      })
    })
    let newdates = [];
    this.httpService.getSelectedDate(req).subscribe((res: any) => {
      if (res && res.length > 0) {

        this.selectedPrefrence = [];
        let addDates = [];
        this.selectedIncludedPrefrence.forEach(res => {
          if(this.prefrenceListToInclude.find(val => val.name === res)) {
            this.prefrenceListToInclude.find(val => val.name === res).dates.forEach(date => {
              addDates.push(date);
            })
          }
        })
        this.selectedPrefrence = [...this.selectedPrefrence, ...addDates];

        if(res.length === 1) {
          if(this.afterBeforeDaySelection === 'DAY_BEFORE') {
            // this.selectedPrefrence = [];
            res.forEach(item => {
              newdates.push(moment(item).subtract(1, "days").format('L'));
            })
          } 
  
          if(this.afterBeforeDaySelection === 'DAY_AFTER') {
            // this.selectedPrefrence = [];
            res.forEach(item => {
              newdates.push(moment(item).add(1, "days").format('L'));
            })
          }
  
          if(!this.afterBeforeDaySelection) {
            // this.selectedPrefrence = [];
            res.forEach(item => {
              newdates.push(moment(item).format('L'));
            })
          }
        } else {

          // this.selectedPrefrence = [];
          res.forEach(item => {
            newdates.push(moment(item).format('L'));
          })
        }
        this.selectedPrefrence = [...this.selectedPrefrence, ...newdates];
      }
    }, err => {
      console.error(err);
    })

  }

  sendYearChanged(year) {
    this.changeYear((new Date(year)).getFullYear());
    // this.getAvailableRules(this.selectedYear);
  }

  

  enableRuleConfirm() {
    if (this.createRequestData()) {
      let reqData = this.createUpdateRequestData();
       
      // check for reqData
      reqData.forEach(item => {
        item.isActive = 'ACTIVE';
      })

      this.httpService.updateSelectedRule(reqData).subscribe((res: any) => {
        if (res && res.message === 'HOLIDAY_UPDATED_SUCCESSFULLY') {
          this.closeEnableModal.nativeElement.click();
          this.router.navigate(['dashboard']);
        }
      }, err => {
        console.error(err);
      })
    }
  }

  disableRuleConfirm() {
    if (this.createRequestData()) {
      let reqData = this.createUpdateRequestData();
       
      // check for reqData
      reqData.forEach(item => {
        item.isActive = 'IN_ACTIVE';
      })

      this.httpService.updateSelectedRule(reqData).subscribe((res: any) => {
        if (res && res.message === 'HOLIDAY_UPDATED_SUCCESSFULLY') {
          this.disbaleConfirmationModal.nativeElement.click();
          this.router.navigate(['dashboard']);
        }
      }, err => {
        console.error(err);
      })
    }
  }

  saveRule() {
    if (this.createRequestData()) {
      if (this.editRule) {
        let isNameAlreadyExist = false;
        this.availableRules.forEach(item => {
          if(item.toUpperCase() === this.form.value.displayName.toUpperCase()) {
            isNameAlreadyExist = true;
          }
        }) 

        if(isNameAlreadyExist) {
          this.form.controls.displayName.setErrors({alreadyExist: true});
        } else {

          this.form.controls.displayName.setErrors(null);
          let reqData = this.createUpdateRequestData();
          
          this.httpService.updateSelectedRule(reqData).subscribe((res: any) => {
            if (res && res.message === 'HOLIDAY_UPDATED_SUCCESSFULLY') {
              this.closeConfirmationModal.nativeElement.click();
              this.router.navigate(['dashboard']);
            }
          }, err => {
            console.error(err);
          })
        }
      } else {
        
        // Save new rule

        let isNameAlreadyExist = false;
        this.availableRules.forEach(item => {
          if(item.toUpperCase() === this.form.value.name.toUpperCase()) {
            isNameAlreadyExist = true;
          }
        }) 

        if(isNameAlreadyExist) {
          this.form.controls.name.setErrors({alreadyExist: true});
        } else {

          this.form.controls.name.setErrors(null);
          let reqData = this.createRequestData();
          this.httpService.saveSelectedDate(reqData).subscribe((res: any) => {
            if (res && res.message === 'HOLIDAY_PERSISTED_SUCCESSFULLY') {
              this.closeConfirmationModal.nativeElement.click();

              this.router.navigate(['dashboard']);
            }
          }, err => {
            console.error(err);
          })
        }


      }

    }
  }

  createRequestData() {
    let reqData: any = [];
    if ((this.flexibleDates && this.selectedDateList && this.selectedDateList.length > 0) || (!this.flexibleDates && this.selectedMonth && this.selectedWeek && this.selectedDay)) {
      if (this.flexibleDates) {
        reqData = [{
          holidayType: this.form.value.name,
          month: null,
          dayOfTheMonth: '',
          dayOfTheWeek: null,
          weekOfTheMonth: '',
          customDays: "",
          createdUser: 'User',
          lastModifiedUser: '',
          isActive: 'ACTIVE',
          description: this.form.value.description,
          year: this.selectedYear,
          displayName: this.form.value.name,
          rulesIncluded: ''
        }]
        this.selectedIncludedPrefrence.forEach(item => {
          if(reqData[0].rulesIncluded === '') {
            reqData[0].rulesIncluded = item;
          } else {
            reqData[0].rulesIncluded = reqData[0].rulesIncluded + ',' + item;
          }
        })
        this.selectedDateList.forEach(item => {
          if (reqData[0].customDays === '') {
            reqData[0].customDays = reqData[0].customDays + moment(item).format('MM-DD');
          } else {
            reqData[0].customDays = reqData[0].customDays + ',' + moment(item).format('MM-DD');
          }
        })

        return reqData;

      } else {        
        const req = [];

        this.selectedMonth.forEach(month => {
          this.selectedWeek.forEach(week => {
            this.selectedDay.forEach(day => {
              const reqObj = {
                holidayType: this.form.value.name,
                month: month,
                dayOfTheMonth: '',
                dayOfTheWeek: day,
                weekOfTheMonth: week,
                customDays: "",
                createdUser: 'User',
                lastModifiedUser: this.afterBeforeDaySelection,
                isActive: 'ACTIVE',
                description: this.form.value.description,
                year: this.selectedYear,
                displayName: this.form.value.name,
                rulesIncluded: ''
              }


              this.selectedIncludedPrefrence.forEach(item => {
                if(reqObj.rulesIncluded === '') {
                  reqObj.rulesIncluded = item;
                } else {
                  reqObj.rulesIncluded = reqObj.rulesIncluded + ',' + item;
                }
              })

              req.push(reqObj);
            })
          })
        })
        return req;
      }
    } else {
      return false;
    }
  }

  createUpdateRequestData() {
    let reqData: any = [];
    if ((this.flexibleDates && this.selectedDateList && this.selectedDateList.length > 0) || (!this.flexibleDates && this.selectedMonth && this.selectedWeek && this.selectedDay)) {
      if (this.flexibleDates) {
        reqData = [{
          holidayType: this.form.controls.name.value,
          month: null,
          dayOfTheMonth: '',
          dayOfTheWeek: null,
          weekOfTheMonth: '',
          customDays: "",
          createdUser: 'User',
          lastModifiedUser: '',
          isActive: 'ACTIVE',
          description: this.form.value.description,
          year: this.selectedYear,
          displayName: this.form.value.displayName,
          rulesIncluded: ''
        }]
        this.selectedIncludedPrefrence.forEach(item => {
          if(reqData[0].rulesIncluded === '') {
            reqData[0].rulesIncluded = item;
          } else {
            reqData[0].rulesIncluded = reqData[0].rulesIncluded + ',' + item;
          }
        })
        this.selectedDateList.forEach(item => {
          if (reqData[0].customDays === '') {
            reqData[0].customDays = reqData[0].customDays + moment(item).format('MM-DD');
          } else {
            reqData[0].customDays = reqData[0].customDays + ',' + moment(item).format('MM-DD');
          }
        })

        return reqData;

      } else {        
        const req = [];
        this.selectedMonth.forEach(month => {
          this.selectedWeek.forEach(week => {
            this.selectedDay.forEach(day => {
              const reqObj = {
                holidayType: this.form.controls.name.value,
                month: month - 1,
                dayOfTheMonth: '',
                dayOfTheWeek: day - 1,
                weekOfTheMonth: week,
                customDays: "",
                createdUser: 'User',
                lastModifiedUser: this.afterBeforeDaySelection,
                isActive: 'ACTIVE',
                description: this.form.value.description,
                year: this.selectedYear,
                displayName: this.form.value.displayName,
                rulesIncluded: ''
              }


              this.selectedIncludedPrefrence.forEach(item => {
                if(reqObj.rulesIncluded === '') {
                  reqObj.rulesIncluded = item;
                } else {
                  reqObj.rulesIncluded = reqObj.rulesIncluded + ',' + item;
                }
              })

              req.push(reqObj);
            })
          })
        })
        return req;
      }
    } else {
      return false;
    }
  }

  dateSelected(dates) {
    this.selectedDateList = dates;
  }


  checkState(el) {
    setTimeout(() => {
      if (this.currentCheckedValue && this.currentCheckedValue === el.value) {
        el.checked = false;
        this.ren.removeClass(el['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(el['_elementRef'].nativeElement, 'cdk-program-focused');
        this.currentCheckedValue = null;
        this.afterBeforeDaySelection = null;
      } else {
        this.currentCheckedValue = el.value
      }

      
    })
  }

  getDateArray(year, month) {

    let startDate = moment(year + '-' + month + '-01'); //YYYY-MM-DD
    const lastDateOfMonth = startDate.daysInMonth();
    let endDate = moment(year + '-' + month + '-' + lastDateOfMonth); //YYYY-MM-DD 
    let arr = new Array();
    let dt = new Date(startDate.format('L'));
    while (dt <= new Date(endDate.format('L'))) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }

}
