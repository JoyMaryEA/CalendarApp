import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {NgFor, AsyncPipe, CommonModule} from '@angular/common';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { UserInfoService } from '../Services/user-info.service';
import { IUser, selectedUserInputField } from '../Interfaces';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

/**
 * @title Highlight the first autocomplete option
 */
@Component({
  selector: 'app-select-user-input',
  standalone: true,
  templateUrl: './select-user-input.component.html',
  styleUrls: ['./select-user-input.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
  ],
})
export class SelectUserInputComponent implements OnInit {
  myControl = new FormControl('');
  iUser: IUser[] = [];
  options: selectedUserInputField[] = [];
  selectedUsers: selectedUserInputField[] = [];
  filteredOptions!: Observable<selectedUserInputField[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;

  constructor(private userService: UserInfoService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.iUser = users;
      this.options = this.iUser.map(user => ({
        username: `${user.first_name} ${user.last_name || ''}`,
        u_id: user.u_id
      }));
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value as string || '')),
      );
    });
  }

  private _filter(value: string): { username: string, u_id: string }[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option =>
      option.username.toLowerCase().includes(filterValue)
    );
  }

  addToSelectedUsers(event: MatAutocompleteSelectedEvent | any): void {
   
    if (event.option) {
      const selectedUsername = event.option.viewValue;
      const selectedUID = event.option.value;
      let selectedUser:selectedUserInputField = {username:selectedUsername, u_id:selectedUID}
      if (!this.selectedUsers.some(user => user.username === selectedUser.username && user.u_id === selectedUser.u_id)) {
        this.selectedUsers.push(selectedUser);
      }
      
    }  
    // Clear input field and reset control
    this.userInput.nativeElement.value = '';
    this.myControl.setValue(null);
  
    console.log(this.selectedUsers); 
  }

  removeFromSelectedUsers(u_id:string){
    const index = this.selectedUsers.findIndex(item => item.u_id === u_id);
    if (index > -1) {
      this.selectedUsers.splice(index, 1); 
    }
  }
  
}