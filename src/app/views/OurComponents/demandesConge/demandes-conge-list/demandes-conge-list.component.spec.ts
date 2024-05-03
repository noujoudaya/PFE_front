import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesCongeListComponent } from './demandes-conge-list.component';

describe('DemandesCongeListComponent', () => {
  let component: DemandesCongeListComponent;
  let fixture: ComponentFixture<DemandesCongeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesCongeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandesCongeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
