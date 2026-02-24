import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageArticlesByCategoryComponentComponent } from './page-articles-by-category-component.component';

describe('PageArticlesByCategoryComponentComponent', () => {
  let component: PageArticlesByCategoryComponentComponent;
  let fixture: ComponentFixture<PageArticlesByCategoryComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageArticlesByCategoryComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageArticlesByCategoryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
