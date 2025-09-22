import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCustomComponent } from './article-custom.component';

describe('ArticleCustomComponent', () => {
  let component: ArticleCustomComponent;
  let fixture: ComponentFixture<ArticleCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
