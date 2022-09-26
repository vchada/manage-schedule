import { Component, OnInit } from '@angular/core';
import { CommonDataService } from './services/common-data.service';
import { HttpService } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isUserLoggedIn = false;
  userName: string;
  userRole: string;
  constructor(private commonDataService: CommonDataService, private httpService: HttpService) {
    this.commonDataService.isUserLoggedChange.subscribe(val => {
      this.isUserLoggedIn = val;
      if(this.isUserLoggedIn) {
        this.getUserByID();
      }
    })

  }

  ngOnInit(): void {
    this.isUserLoggedIn = this.commonDataService.isUserLoggedIn;
    if(this.isUserLoggedIn) {
      this.getUserByID();
    }
  }

  logout() {
    this.commonDataService.logout();
  }

  getUserByID() {
    this.httpService.getUserByID(this.commonDataService.userId).subscribe((res: any) => {
      if(res) {
        this.userName = res.userName;
        this.userRole = res.role.toLowerCase();
      }
    }, err => {
      console.log(err);
    })
  }
  
}
