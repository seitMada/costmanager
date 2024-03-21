import { TestBed } from '@angular/core/testing';

import { SousfamillesService } from './sousfamilles.service';

describe('SousfamillesService', () => {
  let service: SousfamillesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SousfamillesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
