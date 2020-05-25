// src/app/designer/questionnaire.service.ts

import { Injectable } from '@angular/core';

import { Questionnaire } from 'src/app/questionnaire/questionnaire.component';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface QuestionnaireResponse {
  [key: string]: Questionnaire;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private questionnaireURI = '/api/v1/questionnaires';
  refresh = new Subject<void>();
  loading = new Subject<void>();
  selected = new Subject<string>();
  changes = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getQuestionnaires(): Observable<QuestionnaireResponse> {
    return this.http.get<QuestionnaireResponse>(this.questionnaireURI);
  }

  getQuestionnaire(key: string): Observable<Questionnaire> {
    return this.http.get<Questionnaire>(`${this.questionnaireURI}/${key}`);
  }

  getPublishedQuestionnaire(key: string): Observable<Questionnaire> {
    return this.http.get<Questionnaire>(
      `${this.questionnaireURI}/published/${key}`
    );
  }

  // postQuestionnaire(questionnaire: Questionnaire): Observable<{ key: string }> {
  //   return this.http.post<{ key: string }>(
  //     this.questionnaireURI,
  //     questionnaire
  //   );
  // }

  postQuestionnaire2(questionnaire: Questionnaire): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(
      `${this.questionnaireURI}2`,
      questionnaire
    );
  }

  putQuestionnaire(questionnaire: Questionnaire): Observable<void> {
    return this.http.put<void>(
      `${this.questionnaireURI}/${questionnaire.id}`,
      questionnaire
    );
  }

  deleteQuestionnaire(key: string): Observable<void> {
    return this.http.delete<void>(`${this.questionnaireURI}/${key}`);
  }

  listQuestionnaire(questionnaire: Questionnaire): Observable<void> {
    return this.http.put<void>(
      `${this.questionnaireURI}/list/${questionnaire.id}`,
      questionnaire
    );
  }

  unList(questionnaireId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.questionnaireURI}/unlist/${questionnaireId}`
    );
  }
}
