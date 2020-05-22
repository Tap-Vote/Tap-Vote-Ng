// src/app/designer/designer.component.ts

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import {
  QuestionnaireService,
  QuestionnaireResponse
} from 'src/app/designer/questionnaire.service';
import {
  QuestionnaireModalComponent,
  QuestionnaireModalData,
  QuestionnaireModalResponse
} from 'src/app/questionnaire-modal/questionnaire-modal.component';
import { DeleteQuestionnaireModalComponent } from 'src/app/delete-questionnaire-modal/delete-questionnaire-modal.component';
import { AuthService } from 'src/app/auth.service';

export interface Question {
  question: string;
  answer: string;
}

export interface Section {
  name: string;
  questions: Question[];
}

export interface Questionnaire {
  uuid: string;
  name: string;
  sections: Section[];
}

@Component({
  selector: 'tv-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss']
})
export class DesignerComponent implements OnInit {
  private questionnaires: Map<string, Questionnaire> = new Map();
  questionnaireNames: { key: string; name: string }[] = [];
  loading = true;

  constructor(
    private dialogue: MatDialog,
    private questionnaireService: QuestionnaireService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.questionnaireService.getQuestionnaires().subscribe((response) => {
      this.handleQuestionnaireResponse(response);
      this.loading = false;
    });
  }

  private handleQuestionnaireResponse(response: QuestionnaireResponse): void {
    const keys = Object.keys(response);
    keys.forEach((key) => {
      const questionnaire = response[key];
      this.questionnaires.set(key, questionnaire);
      this.questionnaireNames.push({
        key,
        name: questionnaire.name
      });
    });
  }

  onEditQuestionnaire(questionnaireKey: string): void {
    const data: QuestionnaireModalData = {
      editing: true,
      questionnaireKey,
      questionnaire: this.questionnaires.get(questionnaireKey)
    };
    const modalRef = this.dialogue.open(QuestionnaireModalComponent, {
      autoFocus: false,
      width: '75%',
      maxWidth: '75%',
      data
    });

    modalRef.afterClosed().subscribe((result: QuestionnaireModalResponse) => {
      if (result) {
        this.updateData(result);
      }
    });
  }

  onCreateNewQuestionnaire(): void {
    const data: QuestionnaireModalData = {
      editing: false
    };
    const modalRef = this.dialogue.open(QuestionnaireModalComponent, {
      width: '75%',
      maxWidth: '75%',
      data
    });

    modalRef.afterClosed().subscribe((result: QuestionnaireModalResponse) => {
      if (result) {
        this.updateData(result);
      }
    });
  }

  private updateData(response: QuestionnaireModalResponse): void {
    this.questionnaires.set(response.key, response.questionnaire);
    const questionnaireName = this.questionnaireNames.find((nameData) => {
      return nameData.key === response.key;
    });
    if (questionnaireName) {
      questionnaireName.name = response.questionnaire.name;
    } else {
      this.questionnaireNames.push({
        key: response.key,
        name: response.questionnaire.name
      });
    }
  }

  onDeleteQuestionnaire(questionnaireKey: string): void {
    const modalRef = this.dialogue.open(DeleteQuestionnaireModalComponent, {
      autoFocus: false,
      data: this.questionnaires.get(questionnaireKey).name
    });

    modalRef.afterClosed().subscribe((deleteQuestionnaire: boolean) => {
      if (deleteQuestionnaire) {
        this.questionnaireService
          .deleteQuestionnaire(questionnaireKey)
          .subscribe(() => {
            this.questionnaires.delete(questionnaireKey);
            this.questionnaireNames = this.questionnaireNames.filter(
              (nameData) => {
                return nameData.key !== questionnaireKey;
              }
            );
          });
      }
    });
  }

  onLaunch(questionnaireKey: string): void {
    this.router.navigate(['designer', questionnaireKey]);
  }

  onLogout(): void {
    this.authService
      .logout()
      .then((success) => {
        if (success) {
          // TODO: Do I need navigate here?
          // this.router.navigate(['']);
        } else {
          // TODO
        }
      })
      .catch(() => {
        // TODO
      });
  }
}
