import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditPostComponent } from './dialog-edit-post.component';

describe('DialogEditPostComponent', () => {
  let component: DialogEditPostComponent;
  let fixture: ComponentFixture<DialogEditPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
