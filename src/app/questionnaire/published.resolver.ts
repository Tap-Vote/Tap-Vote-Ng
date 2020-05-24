// src/app/questionnaire/published.resolver.ts

import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Questionnaire } from 'src/app/questionnaire/questionnaire.component';
import { QuestionnaireService } from './questionnaire.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublishedResolver implements Resolve<Questionnaire> {
  constructor(private questionnaireService: QuestionnaireService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<Questionnaire> | Promise<Questionnaire> | Questionnaire {
    return this.questionnaireService.getPublishedQuestionnaire(
      route.params['id']
    );
  }
}
