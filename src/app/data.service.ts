import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {


  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get(environment.apiUrl + '/users');
  }

  signup(employee) {
    return this.http.post(environment.apiUrl + '/signup', employee );
  }

}
