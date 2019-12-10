import { TestBed } from '@angular/core/testing';

import { MocktidevService } from './mocktidev.service';

describe('MocktidevService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MocktidevService = TestBed.get(MocktidevService);
    expect(service).toBeTruthy();
  });
});
