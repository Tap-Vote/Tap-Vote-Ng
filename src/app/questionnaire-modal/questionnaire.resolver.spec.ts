// src/app/questionnaire-modal/questionnaire.resolver.spec.ts

import { TestBed } from '@angular/core/testing';

import { QuestionnaireResolver } from 'src/app/questionnaire-modal/questionnaire.resolver';

describe('QuestionnaireResolver', () => {
  let resolver: QuestionnaireResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(QuestionnaireResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
