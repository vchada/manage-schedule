import { Component, Input, OnInit, Output, ViewChild, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent implements OnInit, OnChanges {

  @Input() label;

  @Input() rulesList;
  @Input() alredaySelectedRules;
  @Output() selectedRules = new EventEmitter();

  constructor() { }

   @ViewChild('matAutocomplete') matAutocomplete;

   userControl = new FormControl();
   selectedUsers: any[] = new Array<any>();

   filteredUsers: Observable<any[]>;
   lastFilter: string = '';
 
   ngOnInit() {
     this.filteredUsers = this.userControl.valueChanges.pipe(
       startWith<string | any[]>(''),
       map(value => typeof value === 'string' ? value : this.lastFilter),
       map(filter => this.filter(filter))
     );    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.alredaySelectedRules && changes.alredaySelectedRules.currentValue && changes.alredaySelectedRules.currentValue.length > 0) {
       changes.alredaySelectedRules.currentValue.forEach(item => {
         if(this.rulesList.find(val => val.name = item)) {
          this.initSelection(this.rulesList.find(val => val.name = item));
         }
       })
    }
  }

  initSelection(user: any) {
    user.selected = !user.selected;
    if (user.selected) {
      this.selectedUsers.push(user);
    } else {
      const i = this.selectedUsers.findIndex(value => value.name === user.name);
      this.selectedUsers.splice(i, 1);
    }

    this.userControl.setValue(this.selectedUsers);

    let rulesSelected = []
    this.selectedUsers.forEach(item => {
      rulesSelected.push(item.name);
    })
  }

  filter(filter: string): any[] {
    this.lastFilter = filter;
    if (filter) {
      return this.rulesList.filter(option => {
        return option.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      })
    } else {
      return this.rulesList.slice();
    }
  }

  
  displayFn(value: any[] | string): string | undefined {
    let displayValue: string;
    if (Array.isArray(value)) {
      value.forEach((user, index) => {
        if (index === 0) {
          displayValue = user.name;
        } else {
          displayValue += ', ' + user.name;
        }
      });
    } else {
      displayValue = value;
    }
    return displayValue;
  }

  optionClicked(event: Event, user: any) {
    event.stopPropagation();
    this.toggleSelection(user);
  }

  toggleSelection(user: any) {
    user.selected = !user.selected;
    if (user.selected) {
      this.selectedUsers.push(user);
    } else {
      const i = this.selectedUsers.findIndex(value => value.name === user.name);
      this.selectedUsers.splice(i, 1);
    }

    this.userControl.setValue(this.selectedUsers);

    let rulesSelected = []
    this.selectedUsers.forEach(item => {
      rulesSelected.push(item.name);
    })

    this.selectedRules.emit(rulesSelected);


  }



}
