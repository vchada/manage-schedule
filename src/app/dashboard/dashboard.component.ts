import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  displayedColumns = ["select", "name", "isActive", "rulesIncluded", "rulesExcluded",  "description", "createdDateAndTime", "createdUser", "lastModifiedDateAndTime", "lastModifiedUser"];
  dataSource: any = [];

  displayedRuleColumns = ["holidayType", "isActive", "description", "createdDateAndTime", "createdUser", "lastModifiedDateAndTime", "lastModifiedUser"];
  ruleDataSource: any = [];
  selectedYear: any;
  years = [
    2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032
  ]

  selection = new SelectionModel<any>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.forEach(row => this.selection.select(row));
  }

  isRowSelected(row) {
    if(this.selection && this.selection.selected && this.selection.selected.length > 0) {
    return this.selection.selected.find(item => item.id === row.id) ? true : false;
    } else {
      return false;
    }
  }


  constructor(private httpService:HttpService, private router: Router) {}

    ngOnInit() {
        this.httpService.getAllCalender('2022').subscribe((res: any) => {
          if (res) {
            this.dataSource = res;
          }
        }, err => {
          console.error(err);
        })

        this.httpService.getAllRules().subscribe((res: any) => {
          if (res) {
            Object.keys(res).forEach(item => {
              this.ruleDataSource.push(res[item][0]);
            })
          }
        }, err => {
          console.error(err);
        })

    }

    changeYear(year) {

    }
    
    goToDashboard(row) {
      // this.httpService.getRuleDetails(row.holidayType).subscribe((res: any) => {
      //   if (res) {
          // let rulesToIncludeFromRule = [];
          // if(row.rulesIncluded && row.rulesIncluded.split(',').length > 0) {
          //   row.rulesIncluded.split(',').forEach(item => {
          //     this.httpService.getRuleDetails(item).subscribe((res: any) => {
          //       if (res) {
          //         if(res[0].rulesIncluded) {
          //           rulesToIncludeFromRule.push(res[0].rulesIncluded)
          //         }
          //       }
          //     }, err => {
          //       console.error(err);
          //     })
          //   })
          // }

          // let rulesToExcludeFromRule = [];
          // if(row.rulesExcluded && row.rulesExcluded.split(',').length > 0) {
          //   row.rulesExcluded.split(',').forEach(item => {
          //     this.httpService.getRuleDetails(item).subscribe((res: any) => {
          //       if (res) {
          //         if(res[0].rulesExcluded) {
          //           rulesToExcludeFromRule.push(res[0].rulesIncluded)
          //         }
          //       }
          //     }, err => {
          //       console.error(err);
          //     })
          //   })
          // }

          // debugger;
           
          this.router.navigate(['schedule'], {state: row});
      //   }
      // }, err => {
      //   console.error(err);
      // })
    }

    generate() {

    }

    goToCreateRule(row) {
      this.httpService.getRuleDetails(row.holidayType).subscribe((res: any) => {
        if (res) {
           
          this.router.navigate(['create-rule'], {state: res});
        }
      }, err => {
        console.error(err);
      })
    }

}
