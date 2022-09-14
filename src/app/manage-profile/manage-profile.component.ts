import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { User, UserColumns } from './model/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'my-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.scss'],
})
export class ManageProfileComponent {
  displayedColumns: string[] = UserColumns.map((col) => col.key);
  columnsSchema: any = UserColumns;
  dataSource = new MatTableDataSource<User>();

  isAddOrEditInProgress = false;

  constructor(public dialog: MatDialog, private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe((res: any) => {
      res.forEach(item => {
        item['isEdit'] = false;
        item['isAdd'] = false;
        item['isSelected'] = false;
      })
      this.dataSource.data = res;
    });
  }

  onEdit(element) {
    element.isEdit = !element.isEdit;
    this.isAddOrEditInProgress = true;
  }

  editRow(row) {
    if (row.isAdd) {
      this.userService.addUser(row).subscribe((res: any) => {
        if(res.message = 'USER_PERSISTED_SUCCESSFULLY') {
          row.isAdd = false;
          this.isAddOrEditInProgress = false;
        }
      });
    } else {
      this.userService.updateUser(row).subscribe((res: any) => {
        if(res.message = 'USER_UPDATED_SUCCESSFULLY') {
          row.isAdd = false;
          this.isAddOrEditInProgress = false;
        }
      });
    }
  }

  addRow() {
    const newRow: User = {
      userId: '',
      userName: '',
      role: '',
      description: '',
      isEdit: false,
      isAdd: true,
      isSelected: false,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
    this.isAddOrEditInProgress = true;
  }

  removeRow(element) {
    this.userService.deleteUser(element).subscribe((res: any) => {
      if(res.message = 'USER_DELETED_SUCCESSFULLY') {
        this.dataSource.data = this.dataSource.data.filter(
          (u: User) => u.userId !== element.userId
        );
      }
    });
  }

  removeSelectedRows() {
    const users = this.dataSource.data.filter((u: User) => u.isSelected);
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.userService.deleteUsers(users).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: User) => !u.isSelected
            );
          });
        }
      });
  }
}
