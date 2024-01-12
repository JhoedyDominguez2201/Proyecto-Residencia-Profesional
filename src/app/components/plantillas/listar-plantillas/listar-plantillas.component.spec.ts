import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPlantillasComponent } from './listar-plantillas.component';

describe('ListarPlantillasComponent', () => {
  let component: ListarPlantillasComponent;
  let fixture: ComponentFixture<ListarPlantillasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarPlantillasComponent]
    });
    fixture = TestBed.createComponent(ListarPlantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
