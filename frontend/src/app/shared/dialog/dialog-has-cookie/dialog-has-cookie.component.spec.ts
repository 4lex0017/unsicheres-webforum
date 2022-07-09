import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHasCookieComponent } from './dialog-has-cookie.component';

describe('DialogHasCookieComponent', () => {
  let component: DialogHasCookieComponent;
  let fixture: ComponentFixture<DialogHasCookieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogHasCookieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHasCookieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
