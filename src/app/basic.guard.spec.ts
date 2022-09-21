import { TestBed } from '@angular/core/testing';

import { BasicGuard } from './basic.guard';

describe('BasicGuard', () => {
  let guard: BasicGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BasicGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
