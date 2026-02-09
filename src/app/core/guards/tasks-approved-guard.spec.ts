import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { tasksApprovedGuard } from './tasks-approved-guard';

describe('tasksApprovedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => tasksApprovedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
