import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupOverlayComponent } from './popup-overlay.component';

describe('PopupOverlayComponent', () => {
  let component: PopupOverlayComponent;
  let fixture: ComponentFixture<PopupOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
