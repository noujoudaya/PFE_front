import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinPaieCreateComponent } from './bulletin-paie-create.component';

describe('BulletinPaieCreateComponent', () => {
  let component: BulletinPaieCreateComponent;
  let fixture: ComponentFixture<BulletinPaieCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulletinPaieCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulletinPaieCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
