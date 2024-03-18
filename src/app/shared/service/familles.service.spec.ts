import { TestBed } from '@angular/core/testing';

import { FamillesService } from './familles.service';

describe('FamillesService', () => {
  let service: FamillesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamillesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
