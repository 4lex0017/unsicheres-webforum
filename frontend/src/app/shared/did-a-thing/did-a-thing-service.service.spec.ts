import { TestBed } from '@angular/core/testing';

import { DidAThingServiceService } from './did-a-thing-service.service';

describe('DidAThingServiceService', () => {
  let service: DidAThingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DidAThingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
