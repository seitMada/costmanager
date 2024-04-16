import { TestBed } from '@angular/core/testing';

import { InventairesService } from './inventaires.service';

describe('InventairesService', () => {
  let service: InventairesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventairesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
