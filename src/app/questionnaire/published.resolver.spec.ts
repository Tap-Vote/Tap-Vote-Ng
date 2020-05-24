// src/app/questionnaire/published.resolver.spec.ts

import { TestBed } from '@angular/core/testing';

import { PublishedResolver } from 'src/app/questionnaire/published.resolver';

describe('PublishedResolver', () => {
  let resolver: PublishedResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PublishedResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
