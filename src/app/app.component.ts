import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HR web Application';

  // Define a users property to hold our user data
  users: any;

  // Create an instance of the DataService through dependency injection
  constructor(private _dataService: DataService) {
    console.log('in constructor');
    const self = this;
    // Access the Data Service's getUsers() method we defined
    this._dataService.getUsers()
      .subscribe(function (res) {
          self.users = res;
          console.log('this is the res');
          console.log(res);
        }
      );
  }

  signup() {
    const newEmployee = {
      address: 'a',
      avatar: 'a',
      birthdate: Date.now(),
      email: 'momaherg@gmail.com',
      firstName: 'mohamed',
      isHR: true,
      lastName: 'maher',
      salary: 100,
      password: 'mahermaher',
      phone: 0,
      username: 'maher'
    };
    this._dataService.signup(newEmployee).subscribe();
  }
}
