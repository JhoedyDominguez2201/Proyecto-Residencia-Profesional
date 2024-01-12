import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaAvanzadaComponent } from './busqueda-avanzada.component';

describe('BusquedaAvanzadaComponent', () => {
  let component: BusquedaAvanzadaComponent;
  let fixture: ComponentFixture<BusquedaAvanzadaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaAvanzadaComponent]
    });
    fixture = TestBed.createComponent(BusquedaAvanzadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
