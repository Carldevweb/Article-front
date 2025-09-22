import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCreateArticleComponent } from './page-create-article.component';

describe('PageCreateArticleComponent', () => {
  let component: PageCreateArticleComponent;
  let fixture: ComponentFixture<PageCreateArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageCreateArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageCreateArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
