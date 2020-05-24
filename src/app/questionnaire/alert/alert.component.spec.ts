// src/app/questionnaire/alert/alert.component.spec.ts

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponent as QuestionnaireAlertComponent } from 'src/app/questionnaire/alert/alert.component';

describe('AlertComponent', () => {
  let component: QuestionnaireAlertComponent;
  let fixture: ComponentFixture<QuestionnaireAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionnaireAlertComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
