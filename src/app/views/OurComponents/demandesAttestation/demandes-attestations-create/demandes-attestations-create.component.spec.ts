import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesAttestationsCreateComponent } from './demandes-attestations-create.component';

describe('DemandesAttestationsCreateComponent', () => {
  let component: DemandesAttestationsCreateComponent;
  let fixture: ComponentFixture<DemandesAttestationsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesAttestationsCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandesAttestationsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
