import { TestBed } from '@angular/core/testing';

import { MouvementstocksService } from './mouvementstocks.service';

describe('MouvementstocksService', () => {
  let service: MouvementstocksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouvementstocksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
