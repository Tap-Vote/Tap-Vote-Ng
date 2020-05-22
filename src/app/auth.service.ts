// src.app/auth.service.ts

import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app: firebase.app.App;
  private firebaseConfig: Object;
  private localStorageJwtKey = 'tap-vote-jwt';

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
    this.app = firebase.initializeApp(this.firebaseConfig);

    this.app.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((jwt) => {
          localStorage.setItem(this.localStorageJwtKey, jwt);
        });
      } else {
        localStorage.removeItem(this.localStorageJwtKey);
      }
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    return this.app
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((_credential) => {
        return true;
      })
      .catch(() => {
        return false;
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
    return localStorage.getItem(this.localStorageJwtKey);
  }
}
