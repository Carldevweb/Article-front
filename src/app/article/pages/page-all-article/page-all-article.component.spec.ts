import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAllArticleComponent } from './page-all-article.component';

describe('PageAllArticleComponent', () => {
  let component: PageAllArticleComponent;
  let fixture: ComponentFixture<PageAllArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageAllArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageAllArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
