import { TestBed } from '@angular/core/testing';

import { FuchetechniqueService } from './fuchetechnique.service';

describe('FuchetechniqueService', () => {
  let service: FuchetechniqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuchetechniqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
