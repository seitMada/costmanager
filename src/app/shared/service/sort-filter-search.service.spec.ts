import { TestBed } from '@angular/core/testing';

import { SortFilterSearchService } from './sort-filter-search.service';

describe('SortFilterSearchService', () => {
  let service: SortFilterSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortFilterSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
