import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesCongeViewComponent } from './demandes-conge-view.component';

describe('DemandesCongeViewComponent', () => {
  let component: DemandesCongeViewComponent;
  let fixture: ComponentFixture<DemandesCongeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesCongeViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemandesCongeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
