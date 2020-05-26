// src/app/questionnaire/questionnaire.resolver.ts

import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';

import { QuestionnaireService } from 'src/app/questionnaire/questionnaire.service';
import { tap } from 'rxjs/operators';
import { Questionnaire } from 'src/app/questionnaire/questionnaire.component';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireResolver implements Resolve<Questionnaire> {
  constructor(
    private questionnaireService: QuestionnaireService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Questionnaire> | Promise<Questionnaire> | Questionnaire {
    return this.questionnaireService.getQuestionnaire(route.params.id).pipe(
      tap((questionnaire) => {
        if (!questionnaire) {
          this.router.navigate(['questionnaires', 'new']);
        }
      })
    );
  }
}
