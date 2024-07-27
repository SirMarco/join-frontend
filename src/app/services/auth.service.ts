import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  public loginWithUsernameAndPassword(username: string, password: string) {
    const url = environment.baseUrl + '/login/';
    const body = {
      username: username,
      password: password,
    };
    return lastValueFrom(this.http.post(url, body));
  }

  public registerNewUser(username: string, password: string) {
    const url = environment.baseUrl + '/register/';
    const body = { username: username, password: password };
    return lastValueFrom(this.http.post(url, body));
  }

  public logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
