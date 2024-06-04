import { TestBed } from '@angular/core/testing';

import { LieustockageService } from './lieustockage.service';

describe('LieustockageService', () => {
  let service: LieustockageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LieustockageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
