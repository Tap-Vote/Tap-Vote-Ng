// src.app/auth.service.ts

import { Injectable } from '@angular/core';
import * as Firebase from 'firebase/app';
import 'firebase/auth';
import { Router } from '@angular/router';

export interface UserData {
  uid: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app: Firebase.app.App;
  private firebaseConfig: object;
  private localStorageJwtKey = 'tap-vote-jwt';
  private localStorageUserKey = 'tap-vote-user';

  constructor(private router: Router) {
    this.firebaseConfig = {
      apiKey: 'AIzaSyCQ5PH1KwyEOjS56ig9p26v9fyLAkE72d0',
      authDomain: 'tap-vote.firebaseapp.com',
      databaseURL: 'https://tap-vote.firebaseio.com',
      projectId: 'tap-vote',
      storageBucket: 'tap-vote.appspot.com',
      messagingSenderId: '25651618483',
      appId: '1:25651618483:web:89eb96e8c1a867896746c6',
      measurementId: 'G-JSN7NQ3P2H'
    };
    this.app = Firebase.initializeApp(this.firebaseConfig);

    this.app.auth().onAuthStateChanged((user) => {
      if (user) {
        const userData: UserData = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified
        };
        localStorage.setItem(
          this.localStorageUserKey,
          JSON.stringify(userData)
        );
        user.getIdToken().then((jwt) => {
          localStorage.setItem(this.localStorageJwtKey, jwt);
        });
      } else {
        localStorage.removeItem(this.localStorageJwtKey);
        localStorage.removeItem(this.localStorageUserKey);
      }
    });
  }

  async login(email: string, password: string): Promise<Firebase.User> {
    return this.app
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        return this.app.auth().currentUser;
      });
  }

  async signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<Firebase.User> {
    return this.app
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const user = this.app.auth().currentUser;
        user.updateProfile({
          displayName
        });
        user.sendEmailVerification();
        return user;
      });
  }

  async logout(): Promise<boolean> {
    return this.app
      .auth()
      .signOut()
      .then(() => {
        // localStorage.removeItem(this.localStorageJwtKey);
        this.router.navigate(['']);
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  jwt(): string {
    // TODO: Add a loggedIn method and use build in Firebase handling of token and directly call in interceptor
    return localStorage.getItem(this.localStorageJwtKey);
  }

  user(): UserData {
    const userData = localStorage.getItem(this.localStorageUserKey);
    if (userData) {
      return JSON.parse(userData);
    } else {
      return null;
    }
  }

  async resetPassword(email: string): Promise<boolean> {
    return this.app
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
}
