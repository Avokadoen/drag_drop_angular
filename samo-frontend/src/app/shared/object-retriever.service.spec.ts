import { TestBed } from '@angular/core/testing';

import { ObjectRetrieverService } from './object-retriever.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ObjectRetreiverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ObjectRetrieverService]
  }));

  it('should be created', () => {
    const service: ObjectRetrieverService = TestBed.get(ObjectRetrieverService);
    expect(service).toBeTruthy();
  });
});
