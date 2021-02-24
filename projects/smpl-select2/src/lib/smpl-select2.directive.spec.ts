import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SmplSelect2Directive } from './smpl-select2.directive';

describe('SmplSelect2Directive', () => {
  let component: SmplSelect2Directive;
  let fixture: ComponentFixture<SmplSelect2Directive>;

  beforeEach(waitForAsync(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          SmplSelect2Directive
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmplSelect2Directive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
