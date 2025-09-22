import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCreateCategoryComponent } from './page-create-category.component';

describe('PageCreateCategoryComponent', () => {
  let component: PageCreateCategoryComponent;
  let fixture: ComponentFixture<PageCreateCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageCreateCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageCreateCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
