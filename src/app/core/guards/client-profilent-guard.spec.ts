import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { clientProfilentGuard } from './client-profilent-guard';

describe('clientProfilentGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => clientProfilentGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
