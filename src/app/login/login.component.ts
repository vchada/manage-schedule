
import {
  Component,
  OnInit
} from '@angular/core'; 
import { FormControl, FormGroup, Validators } from '@angular/forms'; 
import { Router } from '@angular/router';
import { CommonDataService } from '../services/common-data.service';
import { HttpService } from '../services/http.service';

@Component({
    selector: 'app-login', 
    templateUrl: './login.component.html', 
    styleUrls: ['./login.component.scss']
  }) 
  
export class  LoginComponent implements OnInit {
  loginForm: FormGroup; 
  isUserLoggedIn: boolean = false;
  changePassword: boolean = false;
  userNamePasswordInvalid = false;

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

  constructor(private commonDataService: CommonDataService, private router: Router, private httpService: HttpService) { }
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
    },{ 
      validators: this.password.bind(this)
    });

    this.loginForm.controls.userName.valueChanges.subscribe(() => {
      this.userNamePasswordInvalid = false;
    })

    this.loginForm.controls.password.valueChanges.subscribe(() => {
      this.userNamePasswordInvalid = false;
    })
  } 


  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('confirmPassword1');
    const { value: confirmPassword } = formGroup.get('confirmPassword2');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }
  
  login() {
    if(this.loginForm.valid) {

      if(this.loginForm.controls.password.value !== 'changeit') {
        const reqData = {"userID": this.loginForm.controls.userName.value,"password": this.loginForm.controls.password.value}
        this.httpService.validateUser(reqData).subscribe(res => {
          if(res) {
            sessionStorage.setItem('isUserLoggedIn', 'true');
            sessionStorage.setItem('userID', reqData.userID);
            this.commonDataService.userId = reqData.userID;
            this.commonDataService.setLoginStatus(true);
            this.router.navigate(['dashboard']);
          } else {
            this.userNamePasswordInvalid = true;
          }
        }, err => {
          console.log(err);
        })
        
      } else {
        this.changePassword = true;
        this.loginForm.controls.confirmPassword1.setValidators(Validators.required);
        this.loginForm.controls.confirmPassword2.setValidators(Validators.required);
        this.loginForm.controls.userName.disable();
        this.loginForm.controls.password.disable();
        this.loginForm.updateValueAndValidity();
      }
    }
  }

  onChangePassword() {
    const reqData = {"userID": this.loginForm.controls.userName.value,"password": this.loginForm.controls.confirmPassword1.value}
        this.httpService.updatePassword(reqData).subscribe((res: any) => {
          if(res && res.message === 'USER_UPDATED_SUCCESSFULLY') {
            sessionStorage.setItem('isUserLoggedIn', 'true');
            sessionStorage.setItem('userID', reqData.userID);
            this.commonDataService.userId = reqData.userID;
            this.commonDataService.setLoginStatus(true);
            this.router.navigate(['dashboard']);
          } else {

          }
        }, err => {
          console.log(err);
        })
  }
}