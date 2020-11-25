import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { ApiResponse } from "../models/api/api-response";
import { Observable } from "rxjs";
import { AppSettings } from "../models/app-settings";
import { User } from "../models/data/user.model";
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

const httpFormDataOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/x-www-form-urlencoded"          
  })
}

@Injectable({
  providedIn: "root",
})
export class ApiService {
  static instance: ApiService;

  constructor(private http: HttpClient, private router: Router) {
    ApiService.instance = this;
  }

  baseUrl: string = AppSettings.API_URL;

  public getCurrentUser(): User {
    const user = JSON.parse(localStorage.getItem("currentUserOms"));

    return user as User;
  };

  get(url, params = null): Observable<ApiResponse> {
    var queryStr =
      params != null
        ? "?" +
          Object.keys(params)
            .map((key) => key + "=" + params[key])
            .join("&")
        : "";
    return this.http.get<ApiResponse>(
      this.baseUrl + url + "/" + queryStr,
      httpOptions
    );
  }


  post(url, obj = null): Observable<ApiResponse> {   

    return this.http.post<ApiResponse>(
      this.baseUrl + url,
      JSON.stringify(obj),
      httpOptions
    );
  }

  /**
   * Отправляет application/x-www-form-urlencoded запрос без токена
   * @param url - адрес
   * @param obj - параметр
   */
  postFormData(url, obj = null): Observable<any> {   

    return this.http.post<ApiResponse>(
      this.baseUrl + url,
      obj,
      httpFormDataOptions
    );
  }

  /**
   * Отправка запроса с токеном, application/json
   * @param url 
   * @param obj 
   */
  postByToken(url, obj = null): Observable<ApiResponse> {
    const currentUser = this.getCurrentUser(); //JSON.parse(localStorage.getItem("currentUser"));
    const token = currentUser.access_token;

    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http.post<ApiResponse>(
      this.baseUrl + url,
      JSON.stringify(obj),
      options
    ).pipe(
      tap( // Log the result or error
        data => {
          //console.log(data)
        },
        error => {

          //console.log(error.status)

          if (error.status == 401){

            localStorage.removeItem("currentUserOms")
            //this.currentUser.next(null);
            //this.router.navigate(["/login"])
            window.location.href='/login'
          }

        }        
      )
    );
    
  }
  
}
