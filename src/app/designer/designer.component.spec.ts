// src/app/designer/designer.component.spec.ts

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerComponent } from 'src/app/designer/designer.component';

describe('DesignerComponent', () => {
  let component: DesignerComponent;
  let fixture: ComponentFixture<DesignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DesignerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
