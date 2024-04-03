import { TestBed } from '@angular/core/testing';

import { FichetechniqueService } from './fichetechnique.service';

describe('FuchetechniqueService', () => {
  let service: FichetechniqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FichetechniqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
