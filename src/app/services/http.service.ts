import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators'
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) { }

  getSelectedDate(reqData) {
    return this.http.post('https://jsonplaceholder.typicode.com/getdate', reqData)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  
  getHolidayList(year) {
    return this.http.get('http://localhost:8080/holiday/get-all-holidays/' + year)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
  

  saveSelectedDate(reqData) {
    return this.http.post('http://localhost:8080/holiday/save', reqData)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}