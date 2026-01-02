import { TestBed } from '@angular/core/testing';

import { TaskClientService } from './task-client-service';

describe('TaskClientService', () => {
  let service: TaskClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
