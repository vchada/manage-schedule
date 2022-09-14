import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { User } from '../model/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private serviceUrl = 'http://localhost:8080/user/';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get(this.serviceUrl + 'getUsers')
      .pipe<User[]>(map((data: any) => data));
  }

  updateUser(user: User): Observable<User> {
    const reqdata = {
      userId: user.userId,
        userName: user.userName,
        role: user.role,
        description: user.description
    }
    return this.http.put<User>(this.serviceUrl + 'updateUser', reqdata);
  }

  addUser(user: User): Observable<User> {
    const reqdata = {
      userId: user.userId,
        userName: user.userName,
        role: user.role,
        description: user.description
    }
    return this.http.post<User>(this.serviceUrl + 'saveUser', reqdata);
  }

  deleteUser(user: User): Observable<User> {
    const reqdata = {
      userId: user.userId,
        userName: user.userName,
        role: user.role,
        description: user.description
    }
    return this.http.delete<User>(this.serviceUrl + 'deleteUser', {body: reqdata});
  }

  deleteUsers(users: User[]): Observable<User[]> {
    return forkJoin(
      users.map((user) =>
        this.http.delete<User>(`${this.serviceUrl}/${user.userId}`)
      )
    );
  }
}
