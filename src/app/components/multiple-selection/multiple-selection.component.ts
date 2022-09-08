import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-multiple-selection',
  templateUrl: './multiple-selection.component.html',
  styleUrls: ['./multiple-selection.component.scss'],
})
export class MultipleSelectionComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{

  @Input() label;
        @Input() rulesList;
        @Output() selectedRules = new EventEmitter();
        @Input() alredaySelectedRules;

  /** list of banks */
  protected banks: any[] = [
    {name: 'Bank A (Switzerland)', id: 'A'},
  {name: 'Bank B (Switzerland)', id: 'B'},
  {name: 'Bank C (France)', id: 'C'},
  {name: 'Bank D (France)', id: 'D'},
  {name: 'Bank E (France)', id: 'E'},
  {name: 'Bank F (Italy)', id: 'F'},
  {name: 'Bank G (Italy)', id: 'G'},
  {name: 'Bank H (Italy)', id: 'H'},
  {name: 'Bank I (Italy)', id: 'I'},
  {name: 'Bank J (Italy)', id: 'J'},
  {name: 'Bank Kolombia (United States of America)', id: 'K'},
  {name: 'Bank L (Germany)', id: 'L'},
  {name: 'Bank M (Germany)', id: 'M'},
  {name: 'Bank N (Germany)', id: 'N'},
  {name: 'Bank O (Germany)', id: 'O'},
  {name: 'Bank P (Germany)', id: 'P'},
  ];

  /** control for the selected bank for multi-selection */
  public bankMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public bankMultiFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredBanksMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor() {}

  ngOnInit() {

    // load the initial bank list
    this.filteredBanksMulti.next(this.rulesList.slice());

    // listen for search field value changes
    this.bankMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });

      this.bankMultiCtrl.valueChanges.subscribe(item => {
        this.selectedRules.emit(item);
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.alredaySelectedRules && changes.alredaySelectedRules.currentValue) {
      //  changes.alredaySelectedRules.currentValue.forEach(item => {
      //    if(this.rulesList.find(val => val.name = item)) {
      //     this.initSelection(this.rulesList.find(val => val.name = item));
      //    }
      //  })
      this.bankMultiCtrl.setValue(changes.alredaySelectedRules.currentValue);
    }
  }

  ngAfterViewInit() {
    // this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredBanksMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: any, b: any) =>
          a && b && a.name === b.name;
      });
  }

  protected filterBanksMulti() {
    if (!this.rulesList) {
      return;
    }
    // get the search keyword
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      this.filteredBanksMulti.next(this.rulesList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanksMulti.next(
      this.rulesList.filter((bank) => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }
}
