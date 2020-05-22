// src/app/app-routing.ts

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DesignerComponent } from 'src/app/designer/designer.component';
import { ViewerComponent } from 'src/app/viewer/viewer.component';
import { QuestionnaireResolver } from 'src/app/questionnaire-modal/questionnaire.resolver';
import { LoginComponent } from 'src/app/login/login.component';
import { AuthGuard } from 'src/app/auth.guard';

const routes: Routes = [
  {
    path: 'designer',
    component: DesignerComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'presenter/:id',
  //   component: ViewerComponent,
  //   resolve: { questionnaire: QuestionnaireResolver }
  // },
  // {
  //   path: 'player/:id',
  //   component: ViewerComponent,
  //   resolve: { questionnaire: QuestionnaireResolver }
  // },
  {
    path: 'designer/:id',
    component: ViewerComponent,
    resolve: { questionnaire: QuestionnaireResolver },
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
