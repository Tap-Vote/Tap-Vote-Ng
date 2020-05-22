// src/app/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tv-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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

    if (this.authService.jwt()) {
      this.router.navigate(['designer']);
    }
  }

  valid(name: string): boolean {
    const control = this.loginForm.get(name);
    return control.valid;
  }

  onSubmit(): void {
    this.authService
      .login(
        this.loginForm.get('email').value,
        this.loginForm.get('password').value
      )
      .then((success) => {
        if (success) {
          this.router.navigate(['designer']);
        } else {
          // TODO
        }
      })
      .catch(() => {
        // TODO
      });
  }
}
