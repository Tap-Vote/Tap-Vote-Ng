import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Firebase from 'firebase';

import { Questionnaire } from 'src/app/questionnaire/questionnaire.component';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'tv-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {
  questionnaire: Questionnaire;
  user: Firebase.User;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.questionnaire = data.questionnaire; // TODO: Null check
    });

    this.user = this.authService.user();
  }
}
