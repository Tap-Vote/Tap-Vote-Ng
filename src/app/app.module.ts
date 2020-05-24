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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { DeleteQuestionnaireModalComponent } from 'src/app/questionnaire/delete-questionnaire-modal/delete-questionnaire-modal.component';
import { TokenInterceptor } from 'src/app/token.interceptor';
import { LoginComponent } from 'src/app/login/login.component';
import { TestingComponent } from 'src/app/testing/testing.component';
import { QuestionnaireComponent } from 'src/app/questionnaire/questionnaire.component';
import { EditComponent as EditQuestionnaireComponent } from 'src/app/questionnaire/edit/edit.component';
import { HeaderComponent } from 'src/app/header/header.component';
import { AlertComponent as QuestionnaireAlertComponent } from 'src/app/questionnaire/alert/alert.component';
import { HomeComponent } from 'src/app/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    DeleteQuestionnaireModalComponent,
    LoginComponent,
    TestingComponent,
    QuestionnaireComponent,
    EditQuestionnaireComponent,
    HeaderComponent,
    QuestionnaireAlertComponent,
    HomeComponent
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
    MatCardModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatMenuModule,
    MatProgressBarModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {}
