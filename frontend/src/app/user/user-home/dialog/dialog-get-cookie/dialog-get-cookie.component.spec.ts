import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGetCookieComponent } from './dialog-get-cookie.component';

describe('DialogGetCookieComponent', () => {
  let component: DialogGetCookieComponent;
  let fixture: ComponentFixture<DialogGetCookieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogGetCookieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGetCookieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
