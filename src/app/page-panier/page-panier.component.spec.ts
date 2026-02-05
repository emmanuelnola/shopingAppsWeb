import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePanierComponent } from './page-panier.component';

describe('PagePanierComponent', () => {
  let component: PagePanierComponent;
  let fixture: ComponentFixture<PagePanierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagePanierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagePanierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
