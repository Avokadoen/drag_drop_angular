import { TestBed } from '@angular/core/testing';

import { ObjectRetrieverService } from './object-retriever.service';

describe('ObjectRetreiverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjectRetrieverService = TestBed.get(ObjectRetrieverService);
    expect(service).toBeTruthy();
  });
});
