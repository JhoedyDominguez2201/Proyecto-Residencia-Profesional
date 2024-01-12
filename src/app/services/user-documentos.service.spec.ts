import { TestBed } from '@angular/core/testing';

import { UserDocumentosService } from './user-documentos.service';

describe('UserDocumentosService', () => {
  let service: UserDocumentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDocumentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
