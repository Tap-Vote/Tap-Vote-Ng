// src/app/token.interceptor.spec.ts

import { TestBed } from '@angular/core/testing';

import { TokenInterceptor } from 'src/app/token.interceptor';

describe('TokenService', () => {
  let interceptor: TokenInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    interceptor = TestBed.inject(TokenInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
