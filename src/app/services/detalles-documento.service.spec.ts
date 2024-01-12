import { TestBed } from '@angular/core/testing';

import { DetallesDocumentoService } from './detalles-documento.service';

describe('DetallesDocumentoService', () => {
  let service: DetallesDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetallesDocumentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
