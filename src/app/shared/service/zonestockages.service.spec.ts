import { TestBed } from '@angular/core/testing';

import { ZonestockagesService } from './zonestockages.service';

describe('ZonestockagesService', () => {
  let service: ZonestockagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZonestockagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
