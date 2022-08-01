import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-calendar-table',
  styleUrls: ['./calendar-table.component.scss'],
  templateUrl: 'calendar-table.component.html',
})
export class CalendarTableComponent implements OnInit {
  displayedColumns = ["select", "name", "isActive", "rulesIncluded", "rulesExcluded", "description", "createdDateAndTime", "createdUser", "lastModifiedDateAndTime", "lastModifiedUser"];
  dataSource: MatTableDataSource<any>;

  columns = {
    select: '',
    name: 'Name',
    isActive: 'Active',
    rulesIncluded: 'Rule Included',
    rulesExcluded: 'Rule Excluded',
    description: 'Description',
    createdDateAndTime: 'Created DT TM',
    createdUser: 'Created User',
    lastModifiedDateAndTime: 'Last modified DT TM',
    lastModifiedUser: 'Last modified user'
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() calendarData: any;
  @Output() emitSelectionChange = new EventEmitter();

  selection = new SelectionModel<any>(true, []);

  constructor(private router: Router) {}
  ngOnInit(): void {

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.calendarData);

    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
      if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toLocaleLowerCase();
      }

      return data[sortHeaderId];
    };

    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter);
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


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));

    this.emitSelectionChange.emit(this.selection);
  }

  isRowSelected(row) {
    if (this.selection && this.selection.selected && this.selection.selected.length > 0) {
      return this.selection.selected.find(item => item.id === row.id) ? true : false;
    } else {
      return false;
    }
  }

  selectionChange(event) {
    event.stopPropagation();
    setTimeout(() => {
      this.emitSelectionChange.emit(this.selection);
    }, 10)
  }

  goToDashboard(row) {
    this.router.navigate(['schedule'], { state: row });
  }
}


