import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesAttestationsEditComponent } from './demandes-attestations-edit.component';

describe('DemandesAttestationsEditComponent', () => {
  let component: DemandesAttestationsEditComponent;
  let fixture: ComponentFixture<DemandesAttestationsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesAttestationsEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandesAttestationsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
