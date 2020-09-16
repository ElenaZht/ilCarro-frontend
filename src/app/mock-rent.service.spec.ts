import { TestBed } from '@angular/core/testing';

import { MockRentService } from './mock-rent.service';

describe('MockRentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MockRentService = TestBed.get(MockRentService);
    expect(service).toBeTruthy();
  });
});
