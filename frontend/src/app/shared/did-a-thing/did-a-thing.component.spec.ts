import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DidAThingComponent } from './did-a-thing.component';

describe('DidAThingComponent', () => {
  let component: DidAThingComponent;
  let fixture: ComponentFixture<DidAThingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DidAThingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DidAThingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
