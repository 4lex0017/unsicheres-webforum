import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContactFormComponent } from './dialog-contact-form.component';

describe('DialogContactFormComponent', () => {
  let component: DialogContactFormComponent;
  let fixture: ComponentFixture<DialogContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContactFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
