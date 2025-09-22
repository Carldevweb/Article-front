import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageListCategoryComponent } from './page-list-category.component';

describe('PageListCategoryComponent', () => {
  let component: PageListCategoryComponent;
  let fixture: ComponentFixture<PageListCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageListCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageListCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
