// src/app/questionnaire/questionnaire.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { QuestionnaireService } from 'src/app/questionnaire/questionnaire.service';

export enum QuestionType {
  FREE_RESPONSE,
  MULTIPLE_CHOICE_SINGLE_RESPONSE,
  MULTIPLE_CHOICE_MULTIPLE_RESPONSE
}

export interface Question {
  type: QuestionType;
  multipleResponse?: boolean;
  question: string;
  answer: string | string[];
}

export interface Section {
  name: string;
  questions: Question[];
}

export interface Questionnaire {
  uid: string;
  id?: string;
  name: string;
  sections: Section[];
}

@Component({
  selector: 'tv-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit, OnDestroy {
  questionnaires: Questionnaire[] = [];
  private subs = new Subscription();

  constructor(
    private questionnaireService: QuestionnaireService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.fetchQuestionnaires();
    this.subs.add(
      this.questionnaireService.refresh.subscribe(() => {
        this.fetchQuestionnaires();
      })
    );
  }

  fetchQuestionnaires(): void {
    this.questionnaires = [];
    this.questionnaireService
      .getQuestionnaires()
      .subscribe((questionnaires) => {
        const ids = Object.keys(questionnaires);
        ids.forEach((id) => {
          this.questionnaires.push(questionnaires[id]);
        });
        this.sortQuestionnaires();
      });
  }

  sortQuestionnairesFn(q1: Questionnaire, q2: Questionnaire): number {
    const n1 = q1.name.toLowerCase();
    const n2 = q2.name.toLowerCase();
    if (n1 > n2) {
      return 1;
    } else if (n2 > n1) {
      return -1;
    } else {
      return 0;
    }
  }

  sortQuestionnaires(): void {
    this.questionnaires = this.questionnaires.sort(this.sortQuestionnairesFn);
  }

  onEdit(id: string): void {
    this.router.navigate([id], { relativeTo: this.route });
  }

  onNew(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
