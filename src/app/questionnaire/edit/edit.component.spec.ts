// src/app/questionnaire/edit/edit.component.spec.ts

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComponent as EditQuestionnaireComponent } from './edit.component';

describe('EditComponent', () => {
  let component: EditQuestionnaireComponent;
  let fixture: ComponentFixture<EditQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditQuestionnaireComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
