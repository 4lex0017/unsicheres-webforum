import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditThreadComponent } from './dialog-edit-thread.component';

describe('DialogEditThreadComponent', () => {
  let component: DialogEditThreadComponent;
  let fixture: ComponentFixture<DialogEditThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditThreadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
