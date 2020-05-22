// src/app/designer/questionnaire.service.ts

import { Injectable } from '@angular/core';

import { Questionnaire } from 'src/app/designer/designer.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QuestionnaireResponse {
  [key: string]: Questionnaire;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private questionnaireURI = '/api/v1/questionnaires';

  constructor(private http: HttpClient) {}

  getQuestionnaires(): Observable<QuestionnaireResponse> {
    return this.http.get<QuestionnaireResponse>(this.questionnaireURI);
  }

  getQuestionnaire(key: string): Observable<Questionnaire> {
    return this.http.get<Questionnaire>(`${this.questionnaireURI}/${key}`);
  }

  postQuestionnaire(questionnaire: Questionnaire): Observable<{ key: string }> {
    return this.http.post<{ key: string }>(
      this.questionnaireURI,
      questionnaire
    );
  }

  putQuestionnaire(
    key: string,
    questionnaire: Questionnaire
  ): Observable<void> {
    return this.http.put<void>(
      `${this.questionnaireURI}/${key}`,
      questionnaire
    );
  }

  deleteQuestionnaire(key: string): Observable<void> {
    return this.http.delete<void>(`${this.questionnaireURI}/${key}`);
  }
}
