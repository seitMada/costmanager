import { TestBed } from '@angular/core/testing';

import { GroupeAnalytiqueService } from './groupe-analytique.service';

describe('GroupeAnalytiqueService', () => {
  let service: GroupeAnalytiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupeAnalytiqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
