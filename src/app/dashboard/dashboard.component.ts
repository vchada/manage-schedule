import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  displayedColumns = ["name", "isActive", "rulesIncluded", "rulesExcluded",  "description", "createdDateAndTime", "createdUser", "lastModifiedDateAndTime", "lastModifiedUser"];
  dataSource: any = [];

  displayedRuleColumns = ["holidayType", "isActive", "description", "createdDateAndTime", "createdUser", "lastModifiedDateAndTime", "lastModifiedUser"];
  ruleDataSource: any = [];

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
    
    goToDashboard(row) {
      // this.httpService.getRuleDetails(row.holidayType).subscribe((res: any) => {
      //   if (res) {
           
          this.router.navigate(['schedule'], {state: row});
      //   }
      // }, err => {
      //   console.error(err);
      // })
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
