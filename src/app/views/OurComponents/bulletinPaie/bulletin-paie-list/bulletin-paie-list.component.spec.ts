import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinPaieListComponent } from './bulletin-paie-list.component';

describe('BulletinPaieListComponent', () => {
  let component: BulletinPaieListComponent;
  let fixture: ComponentFixture<BulletinPaieListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulletinPaieListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulletinPaieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
