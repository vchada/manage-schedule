import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommonDataService {

    yearChangeEvt = new Subject();
    isUserLoggedIn: boolean;
    isUserLoggedChange: Subject<any> = new Subject<any>();
     constructor(private router: Router) {}

    setYearChange(year) {
        this.yearChangeEvt.next(year);
    }

    setLoginStatus(val) {
      this.isUserLoggedIn = val;
      this.isUserLoggedChange.next(val);
    }

    logout() {
      sessionStorage.removeItem('isUserLoggedIn');
      setTimeout(() => {
        this.setLoginStatus(false);
        this.router.navigate(['']);

      }, 100)

    }
}