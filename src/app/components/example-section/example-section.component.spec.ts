import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { YearCalendarModule } from 'src/app/lib/year-calendar.module';

import { ExampleSectionComponent } from './example-section.component';

describe('ExampleSectionComponent', () => {
  let component: ExampleSectionComponent;
  let fixture: ComponentFixture<ExampleSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [YearCalendarModule],
      declarations: [ ExampleSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
