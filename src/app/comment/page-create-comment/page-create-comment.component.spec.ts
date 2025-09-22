import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCreateCommentComponent } from './page-create-comment.component';

describe('PageCreateCommentComponent', () => {
  let component: PageCreateCommentComponent;
  let fixture: ComponentFixture<PageCreateCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageCreateCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageCreateCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
