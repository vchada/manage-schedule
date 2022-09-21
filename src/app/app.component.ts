import { Component, OnInit } from '@angular/core';
import { CommonDataService } from './services/common-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isUserLoggedIn = false;
  constructor(private commonDataService: CommonDataService) {
    this.commonDataService.isUserLoggedChange.subscribe(val => {
      this.isUserLoggedIn = val
    })

  }

  ngOnInit(): void {
    this.isUserLoggedIn = this.commonDataService.isUserLoggedIn;
  }

  logout() {
    this.commonDataService.logout();
  }
  
}
