import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployesListComponent } from './employes-list.component';

describe('EmployesListComponent', () => {
  let component: EmployesListComponent;
  let fixture: ComponentFixture<EmployesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
