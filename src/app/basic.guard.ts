import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonDataService } from './services/common-data.service';

@Injectable({
  providedIn: 'root'
})
export class BasicGuard implements CanActivate {
  constructor(private router: Router, private commonDataService: CommonDataService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkLogin();
  }

  checkLogin() {
    if(sessionStorage.getItem('isUserLoggedIn') === 'true') {
      this.commonDataService.setLoginStatus(true);
      return true;
    }
    this.router.navigate(['']);
    return false;
  }
  
}
