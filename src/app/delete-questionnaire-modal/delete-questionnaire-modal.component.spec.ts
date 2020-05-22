// src/app/delete-questionnaire-modal/delete-questionnaire-modal.component.spec.ts

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteQuestionnaireModalComponent } from 'src/app/delete-questionnaire-modal/delete-questionnaire-modal.component';

describe('DeleteQuestionnaireModalComponent', () => {
  let component: DeleteQuestionnaireModalComponent;
  let fixture: ComponentFixture<DeleteQuestionnaireModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteQuestionnaireModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteQuestionnaireModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
