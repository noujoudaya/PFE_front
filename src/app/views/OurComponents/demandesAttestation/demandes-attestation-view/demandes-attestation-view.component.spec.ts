import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesAttestationViewComponent } from './demandes-attestation-view.component';

describe('DemandesAttestationViewComponent', () => {
  let component: DemandesAttestationViewComponent;
  let fixture: ComponentFixture<DemandesAttestationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesAttestationViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandesAttestationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
