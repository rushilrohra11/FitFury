import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private readonly STORAGE_KEY = 'fitfury_users';
  private users: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>([]);

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const storedUsers = localStorage.getItem(this.STORAGE_KEY);
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
      this.usersSubject.next(this.users);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  registerUser(userData: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    // Check if email already exists
    if (this.users.some(user => user.email === userData.email)) {
      return throwError(() => new Error('Email already exists'));
    }

    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date()
    };

    this.users.push(newUser);
    this.usersSubject.next(this.users);
    this.saveToLocalStorage();

    return of(newUser);
  }

  login(email: string, password: string): Observable<User> {
    return of(this.users).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
          throw new Error('Invalid email or password');
        }
        return user;
      })
    );
  }

  getUserByEmail(email: string): Observable<User | undefined> {
    return of(this.users.find(user => user.email === email));
  }

  getAllUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }
}
