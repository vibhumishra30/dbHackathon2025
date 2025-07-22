import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080';

  private currentUserSubject = new BehaviorSubject<string | null>(null);
  public user$: Observable<string | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  signup(user: {
    name: string;
    email: string;
    contactNumber: string;
    password: string;
  }): Observable<string> {
      return this.http.post(`${this.baseUrl}/signup`, user, {
      responseType: 'text',
    }).pipe(
      tap((response: string) => {
        if (response === 'User registered successfully!') { 
          this.currentUserSubject.next(user.email);  
        } else {
          this.currentUserSubject.next(null);
        }
      })
    );
  }

  login(email: string, password: string): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/login`,
      { email, password },
      { responseType: 'text' }
    ).pipe(
      tap((response: string) => {
        if (response === 'Login successful!') {
          this.currentUserSubject.next(email);  
        } else {
          this.currentUserSubject.next(null);
        }
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }
}
