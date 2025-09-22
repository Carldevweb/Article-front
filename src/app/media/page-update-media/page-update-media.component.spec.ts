import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageUpdateMediaComponent } from './page-update-media.component';

describe('PageUpdateMediaComponent', () => {
  let component: PageUpdateMediaComponent;
  let fixture: ComponentFixture<PageUpdateMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageUpdateMediaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageUpdateMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
