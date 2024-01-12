import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesDocumentoComponent } from './detalles-documento.component';

describe('DetallesDocumentoComponent', () => {
  let component: DetallesDocumentoComponent;
  let fixture: ComponentFixture<DetallesDocumentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallesDocumentoComponent]
    });
    fixture = TestBed.createComponent(DetallesDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
