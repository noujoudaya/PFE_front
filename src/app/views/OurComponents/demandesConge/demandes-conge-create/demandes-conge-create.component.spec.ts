import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesCongeCreateComponent } from './demandes-conge-create.component';

describe('DemandesCongeCreateComponent', () => {
  let component: DemandesCongeCreateComponent;
  let fixture: ComponentFixture<DemandesCongeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesCongeCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandesCongeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
