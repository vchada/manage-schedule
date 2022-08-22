import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-rule-table',
  styleUrls: ['./rule-table.component.scss'],
  templateUrl: 'rule-table.component.html',
})
export class RuleTableComponent implements OnInit {
  displayedColumns = ["displayName", "isActive", "description", "createdDateAndTime", "createdUser", "lastModifiedDateAndTime", "lastModifiedUser"];
  dataSource: MatTableDataSource<any>;

  value = '';

  columns = {

    displayName: 'Rule Name', 
    isActive: 'Active', 
    description: 'Description', 
    createdDateAndTime: 'Create date and time', 
    createdUser: 'Created User', 
    lastModifiedDateAndTime: 'Last modified date and time', 
    lastModifiedUser: 'Last modified user',
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() ruleData: any;

  constructor(private router: Router, private httpService: HttpService) {}
  ngOnInit(): void {

    // Assign the data to the data source for the table to renders
    this.dataSource = new MatTableDataSource(this.ruleData);

    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
      if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toLocaleLowerCase();
      }

      return data[sortHeaderId];
    };

    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.displayName.toLowerCase().includes(filter);
    };
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  clear() {
    this.value = '';
    this.dataSource.filter = '';
  }

  goToCreateRule(row) {
    this.httpService.getRuleDetails(row.holidayType).subscribe((res: any) => {
      if (res) {

        this.router.navigate(['create-rule'], { state: res });
      }
    }, err => {
      console.error(err);
    })
  }

}


