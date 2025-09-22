import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEditArticleComponent } from './page-edit-article.component';

describe('PageEditArticleComponent', () => {
  let component: PageEditArticleComponent;
  let fixture: ComponentFixture<PageEditArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageEditArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageEditArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
