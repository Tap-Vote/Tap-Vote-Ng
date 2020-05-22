// src/app/questionnaire-modal/questionnaire.resolver.ts

import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Questionnaire } from 'src/app/designer/designer.component';
import { QuestionnaireService } from 'src/app/designer/questionnaire.service';

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
    _state: RouterStateSnapshot
  ): Observable<Questionnaire> | Promise<Questionnaire> | Questionnaire {
    return this.questionnaireService.getQuestionnaire(route.params['id']).pipe(
      tap((questionnaire) => {
        if (!questionnaire) {
          this.router.navigate(['designer']);
        }
      })
    );
  }
}
