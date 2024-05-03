import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesCongeEditComponent } from './demandes-conge-edit.component';

describe('DemandesCongeEditComponent', () => {
  let component: DemandesCongeEditComponent;
  let fixture: ComponentFixture<DemandesCongeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesCongeEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandesCongeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
