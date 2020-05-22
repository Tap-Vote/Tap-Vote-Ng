// src/app/viewer/viewer.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Questionnaire } from 'src/app/designer/designer.component';

@Component({
  selector: 'tv-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  questionnaire: Questionnaire;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.questionnaire = data['questionnaire'];
    });
  }
}
