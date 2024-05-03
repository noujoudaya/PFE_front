import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesAttestationListComponent } from './demandes-attestation-list.component';

describe('DemandesAttestationListComponent', () => {
  let component: DemandesAttestationListComponent;
  let fixture: ComponentFixture<DemandesAttestationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesAttestationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandesAttestationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
