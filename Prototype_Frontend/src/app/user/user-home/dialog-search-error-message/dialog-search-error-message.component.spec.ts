import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSearchErrorMessageComponent } from './dialog-search-error-message.component';

describe('DialogSearchErrorMessageComponent', () => {
  let component: DialogSearchErrorMessageComponent;
  let fixture: ComponentFixture<DialogSearchErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSearchErrorMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSearchErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
