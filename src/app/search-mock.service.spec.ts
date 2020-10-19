import { TestBed } from '@angular/core/testing';

import { SearchMockService } from './search-mock.service';

describe('SearchMockService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchMockService = TestBed.get(SearchMockService);
    expect(service).toBeTruthy();
  });
});
