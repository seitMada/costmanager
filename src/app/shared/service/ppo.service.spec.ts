import { TestBed } from '@angular/core/testing';

import { PpoService } from './ppo.service';

describe('PpoService', () => {
  let service: PpoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PpoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
