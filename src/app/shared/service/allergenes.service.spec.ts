import { TestBed } from '@angular/core/testing';

import { AllergenesService } from './allergenes.service';

describe('AllergenesService', () => {
  let service: AllergenesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllergenesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
