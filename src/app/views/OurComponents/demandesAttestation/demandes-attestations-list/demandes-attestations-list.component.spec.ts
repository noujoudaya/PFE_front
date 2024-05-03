import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesAttestationsListComponent } from './demandes-attestations-list.component';

describe('DemandesAttestationsListComponent', () => {
  let component: DemandesAttestationsListComponent;
  let fixture: ComponentFixture<DemandesAttestationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesAttestationsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandesAttestationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
