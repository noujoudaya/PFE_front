import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetardListComponent } from './retard-list.component';

describe('RetardListComponent', () => {
  let component: RetardListComponent;
  let fixture: ComponentFixture<RetardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetardListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RetardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
