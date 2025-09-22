import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateFullContainerComponent } from './template-full-container.component';

describe('TemplateFullContainerComponent', () => {
  let component: TemplateFullContainerComponent;
  let fixture: ComponentFixture<TemplateFullContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateFullContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateFullContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
