import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPlantillaConSeleccionComponent } from './crear-plantilla-con-seleccion.component';

describe('CrearPlantillaConSeleccionComponent', () => {
  let component: CrearPlantillaConSeleccionComponent;
  let fixture: ComponentFixture<CrearPlantillaConSeleccionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearPlantillaConSeleccionComponent]
    });
    fixture = TestBed.createComponent(CrearPlantillaConSeleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
