  import { ComponentFixture, TestBed } from '@angular/core/testing';

  import { CrearDocumentoComponent } from './crear-documento.component';

  describe('CrearDocumentoComponent', () => {
    let component: CrearDocumentoComponent;
    let fixture: ComponentFixture<CrearDocumentoComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CrearDocumentoComponent]
      });
      fixture = TestBed.createComponent(CrearDocumentoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
