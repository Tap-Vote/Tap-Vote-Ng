// src/app/questionnaire/delete-questionnaire-modal/delete-questionnaire-modal.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'tv-delete-questionnaire-modal',
  templateUrl: './delete-questionnaire-modal.component.html',
  styleUrls: ['./delete-questionnaire-modal.component.scss']
})
export class DeleteQuestionnaireModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<DeleteQuestionnaireModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
