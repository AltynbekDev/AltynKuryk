import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../models/data/user.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSettings } from "../models/app-settings";
import { ApiResponse } from "../models/api/api-response";
import { Router } from "@angular/router";
import { take } from 'rxjs/operators';
import { ApiService } from './api.service';


@Injectable({
  providedIn: "root",
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser = new BehaviorSubject<User>(JSON.parse(localStorage.getItem("currentUserOms")) as User);

  constructor(private router: Router, private apiService: ApiService) {

    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUserOms")) as User
    );

    //this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   * Аутентификация по логин-пароль
   * @param username логин
   * @param password пароль
   * @param id ид
   */
  login(username: string, password: string, id: number) {
    return new Promise((resolve, reject) => {

      var authData = `grant_type=password&username=${username}&password=${password}`

      this.apiService.postFormData('Login/Auth', authData).pipe(take(1))
        .subscribe(
          (res) => {

            let data = res as User

            if (data.access_token) {

              data.Id = id
              data.Name = username

              localStorage.setItem("currentUserOms", JSON.stringify(data));

              this.currentUser.next(data);

              resolve(data);

            } else {
              reject(data);
            }
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  logout() {
    localStorage.removeItem("currentUserOms");
    this.currentUser.next(null);
    this.router.navigate(["/login"]);
  }

  getRoles(token: string): Observable<ApiResponse> {

    return this.apiService.postByToken('User/GetInfo')
  }
}
