import { TestBed } from '@angular/core/testing';

import { UserThreadViewService } from './user-thread-view.service';

describe('UserThreadViewService', () => {
  let service: UserThreadViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserThreadViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
