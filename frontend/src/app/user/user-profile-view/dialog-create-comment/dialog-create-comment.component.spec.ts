import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateCommentComponent } from './dialog-create-comment.component';

describe('DialogCreateCommentComponent', () => {
  let component: DialogCreateCommentComponent;
  let fixture: ComponentFixture<DialogCreateCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
