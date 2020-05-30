// src/app/header/header.component.ts

import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tv-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onLogout(): void {
    this.authService.logout();
  }

  onLogin(): void {
    this.router.navigate(['login']);
  }

  loggedIn(): boolean {
    return this.authService.loggedIn();
  }

  onCreateAccount(): void {
    this.router.navigate(['signup']);
  }

  onProfile(): void {
    // TODO
    console.log('TODO');
  }
}
