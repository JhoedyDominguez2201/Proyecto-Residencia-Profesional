import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAdministrativosComponent } from './editar-administrativos.component';

describe('EditarAdministrativosComponent', () => {
  let component: EditarAdministrativosComponent;
  let fixture: ComponentFixture<EditarAdministrativosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarAdministrativosComponent]
    });
    fixture = TestBed.createComponent(EditarAdministrativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
