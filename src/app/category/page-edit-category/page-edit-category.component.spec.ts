import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEditCategoryComponent } from './page-edit-category.component';

describe('PageEditCategoryComponent', () => {
  let component: PageEditCategoryComponent;
  let fixture: ComponentFixture<PageEditCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageEditCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageEditCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
