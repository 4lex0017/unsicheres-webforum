import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContactFormDismissComponent } from './dialog-contact-form-dismiss.component';

describe('DialogContactFormDismissComponent', () => {
  let component: DialogContactFormDismissComponent;
  let fixture: ComponentFixture<DialogContactFormDismissComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContactFormDismissComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContactFormDismissComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
