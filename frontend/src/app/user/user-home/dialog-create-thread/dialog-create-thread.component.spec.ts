import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateThreadComponent } from './dialog-create-thread.component';

describe('DialogCreateThreadComponent', () => {
  let component: DialogCreateThreadComponent;
  let fixture: ComponentFixture<DialogCreateThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateThreadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
