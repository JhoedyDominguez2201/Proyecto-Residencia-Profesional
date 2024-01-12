import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDocumentoComponent } from './editar-documento.component';

describe('EditarDocumentoComponent', () => {
  let component: EditarDocumentoComponent;
  let fixture: ComponentFixture<EditarDocumentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarDocumentoComponent]
    });
    fixture = TestBed.createComponent(EditarDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
