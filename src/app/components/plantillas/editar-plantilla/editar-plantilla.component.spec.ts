import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPlantillaComponent } from './editar-plantilla.component';

describe('EditarPlantillaComponent', () => {
  let component: EditarPlantillaComponent;
  let fixture: ComponentFixture<EditarPlantillaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarPlantillaComponent]
    });
    fixture = TestBed.createComponent(EditarPlantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
