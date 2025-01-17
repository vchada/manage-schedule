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
    return this.http.post('http://localhost:8080/dates/preview', reqData)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }


  getHolidayList(year, includeWeekends?) {
    if(includeWeekends === undefined || includeWeekends === null) {
      includeWeekends = false
    }
    return this.http.get('http://localhost:8080/holiday/get-all-holidays/' + year + '/' +includeWeekends)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  
  getUserByID(id) {
    return this.http.get('http://localhost:8080/user/getUserByID/' + id)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  
  getRuleStatus(params) {
    return this.http.get('http://localhost:8080/holiday/get-rule-usage', {params: params})
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

  updateSelectedRule(reqData) {
    return this.http.post('http://localhost:8080/holiday/update-rule', reqData)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  saveCalendar(reqData) {
    return this.http.post('http://localhost:8080/holiday/saveCalendar', reqData)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  updateCalendar(reqData) {
    return this.http.post('http://localhost:8080/holiday/updateCalendar', reqData)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getRuleIds() {
    return this.http.get('http://localhost:8080/holiday/get-all-holidays/2022/false')
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getAllCalender(year) {
    return this.http.get('http://localhost:8080/holiday/get-all-calendars/' + year)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  
  getAllExistingcalenderNames() {
    return this.http.get('http://localhost:8080/holiday/get-all-existing-calendar-names/')
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getAllRules() {
    return this.http.get('http://localhost:8080/holiday/get-all-rules')
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  
  getAllExistingRuleNames() {
    return this.http.get('http://localhost:8080/holiday/get-all-existing-rule-names')
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getRuleDetails(ruleId) {
    return this.http.get('http://localhost:8080/holiday/get-rule-details-by-ruleId', {params: {ruleId: ruleId}})
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  validateUser(reqData) {
    return this.http.post('http://localhost:8080/user/validateUser', reqData)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  updatePassword(reqData) {
    return this.http.put('http://localhost:8080/user/updatePassword', reqData)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }


  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
