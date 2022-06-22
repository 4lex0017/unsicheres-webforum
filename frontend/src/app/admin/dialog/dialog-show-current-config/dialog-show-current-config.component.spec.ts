import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShowCurrentConfigComponent } from './dialog-show-current-config.component';

describe('DialogShowCurrentConfigComponent', () => {
  let component: DialogShowCurrentConfigComponent;
  let fixture: ComponentFixture<DialogShowCurrentConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogShowCurrentConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogShowCurrentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
