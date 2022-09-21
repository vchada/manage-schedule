
import {
  Component,
  OnInit
} from '@angular/core'; 
import { FormControl, FormGroup, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import { CommonDataService } from '../services/common-data.service';

@Component({
    selector: 'app-login', 
    templateUrl: './login.component.html', 
    styleUrls: ['./login.component.scss']
  }) 
  
export class  LoginComponent implements OnInit {
  loginForm: FormGroup; 
  isUserLoggedIn: boolean = false;

  error_messages = {
    'userName': [
      { type: 'required', message: 'User Name is required.' },
    ],

    'password': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password length.' },
      { type: 'maxlength', message: 'password length.' }
    ],
    'confirmPassword1': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password length.' },
      { type: 'maxlength', message: 'password length.' }
    ],
    'confirmPassword2': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password length.' },
      { type: 'maxlength', message: 'password length.' }
    ]
  }

  constructor(private commonDataService: CommonDataService, private router: Router) { }
  ngOnInit(): void {
    this.isUserLoggedIn = this.commonDataService.isUserLoggedIn;
    if(this.isUserLoggedIn || sessionStorage.getItem('isUserLoggedIn') === 'true') {
      this.commonDataService.setLoginStatus(true);
      this.router.navigate(['dashboard']);
    }
    this.loginForm = new FormGroup({
      userName: new FormControl('', Validators.required), 
      password: new FormControl('', Validators.required), 
      confirmPassword1: new FormControl(''), 
      confirmPassword2: new FormControl('')
    });
  } 
  
  login() {
    if(this.loginForm.valid) {
      sessionStorage.setItem('isUserLoggedIn', 'true');
      this.commonDataService.setLoginStatus(true);
      this.router.navigate(['dashboard']);
    }
  }
}