import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrouselUploadComponent } from './carrousel-upload.component';

describe('CarrouselUploadComponent', () => {
  let component: CarrouselUploadComponent;
  let fixture: ComponentFixture<CarrouselUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarrouselUploadComponent]
    });
    fixture = TestBed.createComponent(CarrouselUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
