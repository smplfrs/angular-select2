import { TestBed } from '@angular/core/testing';

import { SmplSelect2Service } from './smpl-select2.service';

describe('SmplSelect2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmplSelect2Service = TestBed.get(SmplSelect2Service);
    expect(service).toBeTruthy();
  });
});
