// src/app/questionnaire/edit/edit.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import {
  Questionnaire,
  Question,
  Section,
  QuestionType
} from 'src/app/questionnaire/questionnaire.component';
import { DeleteQuestionnaireModalComponent } from 'src/app/questionnaire/delete-questionnaire-modal/delete-questionnaire-modal.component';
import { QuestionnaireService } from 'src/app/questionnaire/questionnaire.service';
import { AlertComponent } from '../alert/alert.component';
import { Observable, Subscription, VirtualTimeScheduler } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';

import { CanComponentDeactivate } from 'src/app/can-deactivate.guard';
import { AuthService, UserData } from 'src/app/auth.service';

@Component({
  selector: 'tv-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent
  implements OnInit, OnDestroy, CanComponentDeactivate {
  loading: boolean;
  editing: boolean;
  changes: boolean;
  questionnaire: Questionnaire;
  questionnaireForm: FormGroup;
  private user: UserData;
  private subs = new Subscription();
  private changesSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialogue: MatDialog,
    private questionnaireService: QuestionnaireService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.user = this.authService.user();

    this.subs.add(
      this.questionnaireService.loading.subscribe(() => {
        this.loading = true;
        if (this.changesSub) {
          this.subs.remove(this.changesSub);
          this.changesSub.unsubscribe();
        }
      })
    );

    this.subs.add(
      this.route.data.subscribe((data) => {
        this.changes = false;
        this.questionnaireService.changes.next(false);

        const questionnaire = data.questionnaire;
        if (questionnaire) {
          this.questionnaireService.selected.next(questionnaire.id);
          this.questionnaireService.changes.next(this.changes);
          this.questionnaire = questionnaire;
          this.editing = true;
        } else {
          this.editing = false;
          this.questionnaireService.selected.next(null);
        }

        this.initForm();
        this.loading = false;
      })
    );
  }

  private questionTypeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = Object.values(QuestionType).includes(control.value);
      return valid ? null : { invalidQuestionType: { value: control.value } };
    };
  }

  private buildQuestion(question: Question): FormGroup {
    switch (question.type) {
      case QuestionType.FREE_RESPONSE:
        return this.fb.group({
          type: this.fb.control(question.type, [this.questionTypeValidator]),
          question: this.fb.control(question.question, Validators.required),
          answer: this.fb.control(question.answer, Validators.required)
        });

      case QuestionType.MULTIPLE_CHOICE:
        return this.fb.group({
          type: this.fb.control(question.type, [this.questionTypeValidator]),
          multipleResponse: this.fb.control(
            question.multipleResponse,
            Validators.required
          ),
          question: this.fb.control(question.question, Validators.required),
          answer: this.fb.array(
            (question.answer as string[]).map((answer) => {
              return this.fb.control(answer, Validators.required);
            })
          )
        });
    }
  }

  initForm(): void {
    if (this.editing) {
      this.questionnaireForm = this.fb.group({
        name: this.fb.control(this.questionnaire.name, Validators.required),
        sections: this.fb.array(
          this.questionnaire.sections.map((section) => {
            return this.fb.group({
              name: this.fb.control(section.name, Validators.required),
              questions: this.fb.array(
                section.questions.map((question) => {
                  return this.buildQuestion(question);
                }),
                Validators.required
              )
            });
          }),
          Validators.required
        )
      });
    } else {
      this.questionnaireForm = this.fb.group({
        name: this.fb.control('', Validators.required),
        sections: this.fb.array(
          [
            this.fb.group({
              name: this.fb.control('', Validators.required),
              questions: this.fb.array(
                [
                  this.fb.group({
                    type: this.fb.control(QuestionType.FREE_RESPONSE, [
                      this.questionTypeValidator
                    ]),
                    question: this.fb.control('', Validators.required),
                    answer: this.fb.control('', Validators.required)
                  })
                ],
                Validators.required
              )
            })
          ],
          Validators.required
        )
      });
    }

    this.changesSub = this.questionnaireForm.valueChanges.subscribe(() => {
      this.changes = true;
      this.questionnaireService.changes.next(true);
    });
    this.subs.add(this.changesSub);
  }

  validQuestionnaireName(): boolean {
    const control = this.questionnaireForm.get('name') as FormControl;
    return control.valid || !control.touched;
  }

  sections(): FormArray {
    return this.questionnaireForm.get('sections') as FormArray;
  }

  section(sectionIdx: number): FormGroup {
    return this.sections().controls[sectionIdx] as FormGroup;
  }

  sectionNameControl(sectionIdx: number): FormControl {
    return this.section(sectionIdx).get('name') as FormControl;
  }

  validSectionName(sectionIdx: number): boolean {
    const control = this.sectionNameControl(sectionIdx);
    return control.valid || !control.touched;
  }

  onAddSection(): void {
    const sections = this.sections();
    sections.push(
      this.fb.group({
        name: this.fb.control('', Validators.required),
        questions: this.fb.array(
          [
            this.fb.group({
              type: this.fb.control(QuestionType.FREE_RESPONSE, [
                this.questionTypeValidator
              ]),
              question: this.fb.control('', Validators.required),
              answer: this.fb.control('', Validators.required)
            })
          ],
          Validators.required
        )
      })
    );
  }

  onAddFreeResponseQuestion(sectionIdx: number) {
    const section = this.section(sectionIdx);
    const questions = section.get('questions') as FormArray;
    questions.push(
      this.fb.group({
        type: this.fb.control(QuestionType.FREE_RESPONSE, [
          this.questionTypeValidator
        ]),
        question: this.fb.control('', Validators.required),
        answer: this.fb.control('', Validators.required)
      })
    );
  }

  onAddMultipleChoiceQuestion(sectionIdx: number): void {
    const section = this.section(sectionIdx);
    const questions = section.get('questions') as FormArray;
    questions.push(
      this.fb.group({
        type: this.fb.control(QuestionType.MULTIPLE_CHOICE, [
          this.questionTypeValidator
        ]),
        multipleResponse: this.fb.control(false, Validators.required),
        question: this.fb.control('', Validators.required),
        answer: this.fb.array([
          this.fb.control('', Validators.required),
          this.fb.control('', Validators.required)
        ])
      })
    );
  }

  onAddMultipleChoiceAnswer(sectionIdx: number, questionIdx: number): void {
    const answers = this.answers(sectionIdx, questionIdx);
    answers.push(this.fb.control('', Validators.required));
  }

  questions(sectionIdx: number): FormArray {
    const section = this.section(sectionIdx);
    return section.get('questions') as FormArray;
  }

  question(sectionIdx: number, questionIdx: number): FormGroup {
    const questions = this.questions(sectionIdx);
    return questions.controls[questionIdx] as FormGroup;
  }

  answers(sectionIdx: number, questionIdx: number): FormArray {
    const question = this.question(sectionIdx, questionIdx);
    return question.get('answer') as FormArray;
  }

  onDeleteSection(sectionIdx: number): void {
    const sections = this.sections();
    if (sections.length > 1) {
      sections.removeAt(sectionIdx);
    }
  }

  onDeleteQuestion(sectionIdx: number, questionIdx: number): void {
    const questions = this.questions(sectionIdx);
    if (questions.length > 1) {
      questions.removeAt(questionIdx);
    }
  }

  onDeleteMultipleChoiceAnswer(
    sectionIdx: number,
    questionIdx: number,
    answerIdx: number
  ): void {
    const answers = this.answers(sectionIdx, questionIdx);
    if (answers.length > 2) {
      answers.removeAt(answerIdx);
    }
  }

  private parseQuestion(question: FormGroup): Question {
    const type: QuestionType = question.get('type').value;
    switch (type) {
      case QuestionType.FREE_RESPONSE:
        return {
          type,
          question: question.get('question').value,
          answer: question.get('answer').value
        };

      case QuestionType.MULTIPLE_CHOICE:
        const answers: string[] = [];
        (question.get('answer') as FormArray).controls.forEach(
          (answer: FormControl) => {
            answers.push(answer.value);
          }
        );
        return {
          type,
          multipleResponse: question.get('multipleResponse').value,
          question: question.get('question').value,
          answer: answers
        };
    }
  }

  onSave(): void {
    const questionnaireName = this.questionnaireForm.get('name').value;
    const sectionsFormArray = this.sections();
    const sections: Section[] = [];

    sectionsFormArray.controls.forEach((sectionGroup: FormGroup) => {
      const sectionName = sectionGroup.get('name').value;
      const questionsFormArray = sectionGroup.get('questions') as FormArray;
      const questions: Question[] = [];
      questionsFormArray.controls.forEach((question: FormGroup) => {
        questions.push(this.parseQuestion(question));
      });
      sections.push({
        name: sectionName,
        questions
      });
    });

    const questionnaire: Questionnaire = {
      uid: this.user.uid,
      name: questionnaireName,
      sections
    };

    if (this.editing) {
      questionnaire.id = this.questionnaire.id;
      this.questionnaireService.putQuestionnaire(questionnaire).subscribe(
        () => {
          // TODO: Update questionnaires list...
          this.questionnaireService.refresh.next();
          this.questionnaire = questionnaire;
          this.changes = false;
          this.loading = false;
          this.questionnaireService.changes.next(false);
          this.snackBar.open('Changes saved.', 'Dismiss', {
            duration: 3000
          });
        },
        () => {
          this.snackBar.open('Failed to save changes.', 'Dismiss', {
            duration: 3000
          });
        }
      );
    } else {
      this.questionnaireService.postQuestionnaire2(questionnaire).subscribe(
        (response) => {
          // TODO: Update questionnaires list...
          this.questionnaireService.refresh.next();
          this.changes = false;
          this.questionnaireService.changes.next(false);
          this.router.navigate(['questionnaires', response.id]);
          this.snackBar.open('Questionnaire saved.', 'Dismiss', {
            duration: 3000
          });
        },
        () => {
          this.snackBar.open('Failed to save questionnaire.', 'Dismiss', {
            duration: 3000
          });
        }
      );
    }
  }

  onDelete(): void {
    const modalRef = this.dialogue.open(DeleteQuestionnaireModalComponent, {
      autoFocus: false,
      data: this.questionnaire.name
    });

    modalRef.afterClosed().subscribe((deleteConfirmed) => {
      if (deleteConfirmed) {
        this.questionnaireService
          .deleteQuestionnaire(this.questionnaire.id)
          .subscribe(
            () => {
              // TODO: Update questionnaires list...
              this.changes = false;
              this.loading = true;
              this.questionnaireService.changes.next(false);
              this.questionnaireService.refresh.next();
              this.router.navigate(['/questionnaires', 'new']);
              this.snackBar.open('Questionnaire deleted.', 'Dismiss', {
                duration: 3000
              });
            },
            () => {
              this.snackBar.open(
                'Failed to deleted questionnaire.',
                'Dismiss',
                {
                  duration: 3000
                }
              );
            }
          );
        this.questionnaireService.unList(this.questionnaire.id).subscribe();
      }
    });
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.changes) {
      const modalRef = this.dialogue.open(AlertComponent, {
        autoFocus: false
      });

      return modalRef.afterClosed().pipe(
        tap((confirmed: boolean) => {
          this.loading = confirmed;
          this.changes = !confirmed;
          this.questionnaireService.changes.next(!confirmed);
        })
      );
    } else {
      return true;
    }
  }

  private copy(text: string): void {
    const sharable = document.createElement('textarea');
    sharable.style.position = 'fixed';
    sharable.style.top = '0';
    sharable.style.left = '0';
    sharable.style.opacity = '0';
    sharable.value = text;
    document.body.appendChild(sharable);
    sharable.select();
    document.execCommand('copy');
    document.body.removeChild(sharable);
  }

  onList(): void {
    this.questionnaireService.listQuestionnaire(this.questionnaire).subscribe(
      () => {
        this.snackBar.open('Questionnaire listed.', 'Dismiss', {
          duration: 3000
        });
        this.copy(
          `${window.location.origin}/published/${this.questionnaire.id}`
        );
      },
      () => {
        this.snackBar.open('Failed to list questionnaire.', 'Dismiss', {
          duration: 3000
        });
      }
    );
  }

  onUnList(): void {
    this.questionnaireService.unList(this.questionnaire.id).subscribe(
      () => {
        this.snackBar.open('Questionnaire un listed.', 'Dismiss', {
          duration: 3000
        });
      },
      () => {
        this.snackBar.open('Failed to un list questionnaire.', 'Dismiss', {
          duration: 3000
        });
      }
    );
  }
}
