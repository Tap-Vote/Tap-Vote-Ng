// src/app/app-routing.ts

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionnaireResolver } from 'src/app/questionnaire/questionnaire.resolver';
import { LoginComponent } from 'src/app/login/login.component';
import { AuthGuard } from 'src/app/auth.guard';
import { QuestionnaireComponent } from 'src/app/questionnaire/questionnaire.component';
import { EditComponent as EditQuestionnaireComponent } from 'src/app/questionnaire/edit/edit.component';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';
import { HomeComponent } from 'src/app/home/home.component';
import { TestingComponent } from 'src/app/testing/testing.component';
import { PublishedResolver } from 'src/app/questionnaire/published.resolver';

const routes: Routes = [
  {
    path: 'published/:id',
    component: TestingComponent,
    resolve: { questionnaire: PublishedResolver }
  },
  {
    path: 'questionnaires',
    component: QuestionnaireComponent,
    children: [
      {
        path: 'new',
        component: EditQuestionnaireComponent,
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: ':id',
        component: EditQuestionnaireComponent,
        resolve: { questionnaire: QuestionnaireResolver },
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: LoginComponent,
    data: { signup: true }
  },
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
