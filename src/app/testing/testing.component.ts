import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Questionnaire } from 'src/app/questionnaire/questionnaire.component';
import { AuthService, UserData } from 'src/app/auth.service';

@Component({
  selector: 'tv-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {
  questionnaire: Questionnaire;
  user: UserData;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.questionnaire = data['questionnaire']; // TODO: Null check
    });

    this.user = this.authService.user();
  }
}
