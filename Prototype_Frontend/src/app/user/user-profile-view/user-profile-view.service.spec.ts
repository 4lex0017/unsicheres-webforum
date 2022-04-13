import { TestBed } from '@angular/core/testing';

import { UserProfileViewService } from './user-profile-view.service';

describe('UserProfileViewService', () => {
  let service: UserProfileViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProfileViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
