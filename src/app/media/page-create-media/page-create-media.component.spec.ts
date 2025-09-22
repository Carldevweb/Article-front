import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCreateMediaComponent } from './page-create-media.component';

describe('PageCreateMediaComponent', () => {
  let component: PageCreateMediaComponent;
  let fixture: ComponentFixture<PageCreateMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageCreateMediaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageCreateMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
