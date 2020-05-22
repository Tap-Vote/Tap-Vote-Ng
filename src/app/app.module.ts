// src/app/app.module.ts

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { DesignerComponent } from 'src/app/designer/designer.component';
import { QuestionnaireModalComponent } from 'src/app/questionnaire-modal/questionnaire-modal.component';
import { DeleteQuestionnaireModalComponent } from 'src/app/delete-questionnaire-modal/delete-questionnaire-modal.component';
import { ViewerComponent } from 'src/app/viewer/viewer.component';
import { TokenInterceptor } from 'src/app/token.interceptor';
import { LoginComponent } from 'src/app/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    DesignerComponent,
    QuestionnaireModalComponent,
    DeleteQuestionnaireModalComponent,
    ViewerComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    HttpClientModule,
    MatDialogModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatCardModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [QuestionnaireModalComponent]
})
export class AppModule {}
