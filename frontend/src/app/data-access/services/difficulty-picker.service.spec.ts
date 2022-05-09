import { TestBed } from '@angular/core/testing';

import { DifficultyPickerService } from './difficulty-picker.service';

describe('DifficultyPickerService', () => {
  let service: DifficultyPickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DifficultyPickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
