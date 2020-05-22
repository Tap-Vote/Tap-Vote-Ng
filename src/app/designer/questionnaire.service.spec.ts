// src/app/designer/questionnaire.service.spec.ts

import { TestBed } from '@angular/core/testing';

import { QuestionnaireService } from 'src/app/designer/questionnaire.service';

describe('QuestionnaireService', () => {
  let service: QuestionnaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionnaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
