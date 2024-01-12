import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAdministrativosComponent } from './listar-administrativos.component';

describe('ListarAdministrativosComponent', () => {
  let component: ListarAdministrativosComponent;
  let fixture: ComponentFixture<ListarAdministrativosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarAdministrativosComponent]
    });
    fixture = TestBed.createComponent(ListarAdministrativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
