import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  displayedColumns = ["name", "active", "ruleIds", "createdDateAndTime", "createdUser", "lastModifiedDateAndTime", "lastModifiedUser"];
  dataSource: any = [];
 


  constructor(private httpService:HttpService) {}

    ngOnInit() {
        this.httpService.getAllCalender('2022').subscribe((res: any) => {
          if (res) {
            this.dataSource = res;
          }
        }, err => {
          console.error(err);
        })
    }

}
