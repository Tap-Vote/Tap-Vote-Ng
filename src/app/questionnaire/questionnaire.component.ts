// src/app/questionnaire/questionnaire.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { QuestionnaireService } from 'src/app/questionnaire/questionnaire.service';

export enum QuestionType {
  FREE_RESPONSE,
  MULTIPLE_CHOICE
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
  private selectedQuestionnaireId: string;
  private changesOnSelectedQuestionnaire: boolean;
  loading = false;

  constructor(private questionnaireService: QuestionnaireService) {}

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
    this.subs.add(
      this.questionnaireService.selected.subscribe((id) => {
        this.selectedQuestionnaireId = id;
      })
    );
    this.subs.add(
      this.questionnaireService.changes.subscribe((changes) => {
        this.changesOnSelectedQuestionnaire = changes;
      })
    );
  }

  fetchQuestionnaires(): void {
    this.loading = true;
    if (this.selectedQuestionnaireId) {
      this.questionnaireService.loading.next();
    }
    this.questionnaires = [];
    this.questionnaireService
      .getQuestionnaires()
      .subscribe((questionnaires) => {
        const ids = Object.keys(questionnaires);
        ids.forEach((id) => {
          this.questionnaires.push(questionnaires[id]);
        });
        this.sortQuestionnaires();
        this.loading = false;
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
    if (
      this.selectedQuestionnaireId !== id &&
      !this.changesOnSelectedQuestionnaire
    ) {
      this.selectedQuestionnaireId = id;
      this.questionnaireService.loading.next();
    }
  }
}
