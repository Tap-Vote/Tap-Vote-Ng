// src/app/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tv-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signup: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [
        Validators.required,
        Validators.min(8),
        Validators.minLength(8),
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&{}#^()-+=_`~<>\'"/|])[A-Za-zd$@$!%*?&{}#^()-+=_`~<>\'"/|].{7,}'
        )
      ])
    });

    this.route.data.subscribe((data: { signup?: boolean }) => {
      if (data && data.signup) {
        this.signup = true;
        this.loginForm.addControl(
          'name',
          this.fb.control('', [Validators.required])
        );
      } else {
        this.signup = false;
      }
    });

    if (this.authService.jwt()) {
      this.router.navigate(['questionnaires', 'new']);
    }
  }

  valid(name: string): boolean {
    const control = this.loginForm.get(name);
    return control.valid;
  }

  private loginErrorNotification(
    errorMessage: string = '',
    credentials: boolean = true
  ): void {
    const type = this.signup ? 'create account' : 'login';
    if (credentials) {
      this.snackbar.open(`Failed to ${type}. ${errorMessage}`, 'Dismiss', {
        duration: 3000
      });
    } else {
      this.snackbar.open(
        `Failed to ${type}. Email and password are required.`,
        'Dismiss',
        { duration: 3000 }
      );
    }
  }

  onSubmit(): void {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    if (email && password) {
      if (this.signup) {
        this.authService
          .signUp(email, password, this.loginForm.get('name').value)
          .then((user) => {
            if (user) {
              this.router.navigate(['questionnaires', 'new']);
            } else {
              this.loginErrorNotification();
            }
          })
          .catch((error) => {
            this.loginErrorNotification(error.message);
          });
      } else {
        this.authService
          .login(email, password)
          .then((user) => {
            if (user) {
              this.router.navigate(['questionnaires', 'new']);
            } else {
              this.loginErrorNotification();
            }
          })
          .catch((error) => {
            this.loginErrorNotification(error.message);
          });
      }
    } else {
      this.loginErrorNotification('', false);
    }
  }

  private resetNotification(success: boolean): void {
    if (success) {
      this.snackbar.open('Reset email sent successfully.', 'Dismiss', {
        duration: 3000
      });
    } else {
      this.snackbar.open('Failed to send reset email.', 'Dismiss', {
        duration: 3000
      });
    }
  }

  onForgotPassword(): void {
    const email: string = this.loginForm.get('email').value;
    if (email) {
      this.authService
        .resetPassword(email)
        .then((success) => {
          this.resetNotification(success);
        })
        .catch(() => {
          this.resetNotification(false);
        });
    } else {
      this.resetNotification(false);
    }
  }
}
