import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http :HttpClient ) { }

  login(username: string, password: string) {
    return this.http.post(
      'http://localhost:8080/auth/login',
      { username, password },
      { withCredentials: true }
    );
  }

  logout(): Observable<void> {
     return this.http.post<void>(
       `${this.apiUrl}/logout`,
       {},
       { withCredentials: true }
     );
   }
}
