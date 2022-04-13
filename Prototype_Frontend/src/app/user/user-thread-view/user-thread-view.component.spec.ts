import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserThreadViewComponent } from './user-thread-view.component';

describe('UserThreadViewComponent', () => {
  let component: UserThreadViewComponent;
  let fixture: ComponentFixture<UserThreadViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserThreadViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserThreadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
