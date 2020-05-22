// src/app/questionnaire-modal/questionnaire-modal.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormGroup,
  FormArray,
  FormBuilder,
  FormControl,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { v4 as uuid } from 'uuid';

import {
  Questionnaire,
  Section,
  Question
} from 'src/app/designer/designer.component';
import { QuestionnaireService } from 'src/app/designer/questionnaire.service';

export interface QuestionnaireModalData {
  editing: boolean;
  questionnaireKey?: string;
  questionnaire?: Questionnaire;
}

export interface QuestionnaireModalResponse {
  key: string;
  questionnaire: Questionnaire;
}

@Component({
  selector: 'tv-questionnaire-modal',
  templateUrl: './questionnaire-modal.component.html',
  styleUrls: ['./questionnaire-modal.component.scss']
})
export class QuestionnaireModalComponent implements OnInit {
  questionnaireForm: FormGroup;
  header: string;
  disabled = true;

  private validators: ValidatorFn[] = [Validators.required];

  constructor(
    private dialogRef: MatDialogRef<QuestionnaireModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: QuestionnaireModalData,
    private fb: FormBuilder,
    private questionnaireService: QuestionnaireService
  ) {}

  ngOnInit(): void {
    this.header = this.data.editing
      ? 'Edit Questionnaire'
      : 'Create New Questionnaire';
    this.initQuestionnaire();
    this.questionnaireForm.valueChanges.subscribe(() => {
      this.disabled = false;
    });
  }

  initQuestionnaire(): void {
    let questionnaireNameControl: FormControl;
    let sectionsArray: FormArray;
    if (
      this.data.editing &&
      this.data.questionnaireKey &&
      this.data.questionnaire
    ) {
      const sections: FormGroup[] = [];
      this.data.questionnaire.sections.forEach((section) => {
        sections.push(
          this.fb.group({
            section: this.fb.control(section.name, this.validators),
            questions: this.fb.array(
              section.questions.map((question) => {
                const questionGroup = this.fb.group({
                  question: this.fb.control(question.question, this.validators),
                  answer: this.fb.control(question.answer, this.validators)
                });
                return questionGroup;
              })
            )
          })
        );
      });
      questionnaireNameControl = this.fb.control(
        this.data.questionnaire.name,
        this.validators
      );
      sectionsArray = this.fb.array(sections);
    } else {
      questionnaireNameControl = this.fb.control('', this.validators);
      sectionsArray = this.fb.array([
        this.fb.group({
          section: this.fb.control('', this.validators),
          questions: this.fb.array([
            this.fb.group({
              question: this.fb.control('', this.validators),
              answer: this.fb.control('', this.validators)
            })
          ])
        })
      ]);
    }

    this.questionnaireForm = this.fb.group({
      questionnaireName: questionnaireNameControl,
      sections: sectionsArray
    });
  }

  sections(): FormArray {
    return this.questionnaireForm.get('sections') as FormArray;
  }

  questions(sectionIdx: number): FormArray {
    const sections = this.sections();
    const section = sections.controls[sectionIdx] as FormGroup;
    const questions = section.get('questions') as FormArray;
    return questions;
  }

  OnAddQuestion(sectionIdx: number): void {
    const questions = this.questions(sectionIdx);
    questions.push(
      this.fb.group({
        question: this.fb.control('', this.validators),
        answer: this.fb.control('', this.validators)
      })
    );
  }

  onAddSection(): void {
    const sections = this.questionnaireForm.get('sections') as FormArray;
    sections.push(
      this.fb.group({
        section: this.fb.control('', this.validators),
        questions: this.fb.array([])
      })
    );
    this.OnAddQuestion(sections.length - 1);
  }

  onSave(): void {
    const questionnaireName = this.questionnaireForm.get('questionnaireName')
      .value;
    const sectionsFormArray = this.sections();
    const sections: Section[] = [];

    sectionsFormArray.controls.forEach((sectionGroup: FormGroup) => {
      const sectionName = sectionGroup.get('section').value;
      const questionsFormArray = sectionGroup.get('questions') as FormArray;
      const questions: Question[] = [];
      questionsFormArray.controls.forEach((question: FormGroup) => {
        questions.push({
          question: question.get('question').value,
          answer: question.get('answer').value
        });
      });
      sections.push({
        name: sectionName,
        questions
      });
    });

    const questionnaire: Questionnaire = {
      uuid: this.data.editing ? this.data.questionnaire.uuid : uuid(),
      name: questionnaireName,
      sections
    };

    if (this.data.editing) {
      this.questionnaireService
        .putQuestionnaire(this.data.questionnaireKey, questionnaire)
        .subscribe(() => {
          const modalResponse: QuestionnaireModalResponse = {
            key: this.data.questionnaireKey,
            questionnaire
          };
          this.dialogRef.close(modalResponse);
        });
    } else {
      this.questionnaireService
        .postQuestionnaire(questionnaire)
        .subscribe((response) => {
          const modalResponse: QuestionnaireModalResponse = {
            key: response.key,
            questionnaire
          };
          this.dialogRef.close(modalResponse);
        });
    }
  }
}
