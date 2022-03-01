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

<div class="container">
<div class="row mb-3 mt-3">
	<div class="col-12 d-flex">
		<select class="form-select form-select-sm" aria-label=".form-select-sm example">
			<option selected>Open this select menu</option>
			<option value="1">One</option>
			<option value="2">Two</option>
			<option value="3">Three</option>
		</select>

		<a href="javascript:void(0)" class="text-decoration-none ms-2 custom-icon">
			<i class="bi-plus-square bi"></i>
		</a>

		<a href="javascript:void(0)" class="text-decoration-none ms-2 custom-icon ">
			<i class="bi-pencil-square bi"></i>
		</a>
	</div>
</div>
<div class="row mb-3">
	<div class="col-12 d-flex">
		<select class="form-select form-select-sm" aria-label=".form-select-sm example">
			<option selected>Open this select menu</option>
			<option value="1">One</option>
			<option value="2">Two</option>
			<option value="3">Three</option>
		</select>

		<a href="javascript:void(0)" class="text-decoration-none ms-2 custom-icon">
			<i class="bi-plus-square bi"></i>
		</a>

		<a href="javascript:void(0)" class="text-decoration-none ms-2 custom-icon three-dot-icon ">
			<i class="bi-three-dots bi"></i>
		</a>
	</div>
</div>
<div class="row card">
	<div class="col-12 py-3 px-4 bg-light">
		<div class="row mb-3">
			<div class="col-12">
				<span class="fs-5">Operation</span>
				<span class="fs-6 float-end">https://getbootstrap.com/docs/5.0/forms/select/</span>
			</div>
		</div>

		<div class="row">
			<div class="col-12 px-md-5 ">
				<div class="row mb-2">
					<div class="col-12 col-md-4 fs-6 text-md-end">Request Name</div>
					<div class="col-12 col-md-8">
						<input type="text" class="form-control form-control-sm" placeholder="Enter Request name" aria-label="Request name">
					</div>
				</div>
				<div class="row mb-2">
					<div class="col-12 col-md-4 fs-6 text-md-end">Default Scenario</div>
					<div class="col-12 col-md-8">
						<select class="form-select form-select-sm" aria-label=".form-select-sm example">
							<option selected>Open this select menu</option>
							<option value="1">One</option>
							<option value="2">Two</option>
							<option value="3">Three</option>
						</select>
					</div>
				</div>
				<div class="row mb-2">
					<div class="col-12 col-md-4 fs-6 text-md-end">Default Callback Url</div>
					<div class="col-12 col-md-8">
						<input type="text" class="form-control form-control-sm " placeholder="Enter Default callback Url" aria-label="Default callback Url">
					</div>
				</div>
				<div class="row mb-2">
					<div class="col-12 col-md-4 fs-6 text-md-end">Request Namespaces</div>
					<div class="col-12 col-md-8">
						<textarea class="form-control form-control-sm" id="RequestNamespaces" rows="1"></textarea>
					</div>
				</div>
				<div class="row mb-2">
					<div class="col-12 col-md-4 fs-6 text-md-end">Log Keys</div>
					<div class="col-12 col-md-8">
						<textarea class="form-control form-control-sm" id="LogKeys" rows="1"></textarea>
					</div>
				</div>
				<div class="row mb-2">
					<div class="col-12 col-md-4 fs-6 text-md-end">Scenario Selection Key Field</div>
					<div class="col-12 col-md-8">
						<input type="text" class="form-control form-control-sm" placeholder="Enter Scenario Selection Key Field" aria-label="Scenario Selection Key Field">
					</div>
				</div>
				<div class="row mb-2">
					<div class="col-12 col-md-4 fs-6 text-md-end">Scenario Selection Strategy</div>
					<div class="col-12 col-md-8">
						<textarea class="form-control form-control-sm" id="ScenarioSelectionStrategy" rows="1"></textarea>
					</div>
				</div>
				<div class="row mb-2">
					<div class="col-12 col-md-4"></div>
					<div class="col-12 col-md-8">
						<button type="button" class="btn btn-outline-secondary ">
							<i class="bi bi-file-earmark-arrow-down"></i> Save Operation</button>

						<button type="button" class="btn btn-outline-secondary ms-2">
							<i class="bi bi-three-dots"></i>
						</button>
					</div>
				</div>
			</div>
		</div>

	</div>
</div>
</div>


.custom-icon i {
	font-size: 29px;
	line-height: 29px;
	color: #6F6f6f;
}

.custom-icon:hover i {
	color: #000000;
}

.three-dot-icon {
	border: 2px solid #6F6f6f;
	border-radius: 4px;
	height: 30px;
	width: 33px;
}

.three-dot-icon:hover {
	border: 2px solid #000000;
}

.three-dot-icon i {
	font-size: 19px;
	position: relative;
	left: 4px;
	bottom: 0px;
}

,
            "styles": [
              "node_modules/bootstrap/dist/css/bootstrap.min.css",
              "node_modules/bootstrap-icons/font/bootstrap-icons.css",
              "src/styles.css"
            ],
            "scripts": [
                "node_modules/jquery/dist/jquery.min.js",
                "node_modules/bootstrap/dist/js/bootstrap.min.js"
            ]



