import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommonDataService {

    yearChangeEvt = new Subject();

    setYearChange(year) {
        this.yearChangeEvt.next(year);
    }
}