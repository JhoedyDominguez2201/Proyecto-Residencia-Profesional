import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaSencillaComponent } from './busqueda-sencilla.component';

describe('BusquedaSencillaComponent', () => {
  let component: BusquedaSencillaComponent;
  let fixture: ComponentFixture<BusquedaSencillaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaSencillaComponent]
    });
    fixture = TestBed.createComponent(BusquedaSencillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
