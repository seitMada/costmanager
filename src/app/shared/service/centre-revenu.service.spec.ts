import { TestBed } from '@angular/core/testing';

import { CentreRevenuService } from './centre-revenu.service';

describe('CentreRevenuService', () => {
  let service: CentreRevenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentreRevenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
