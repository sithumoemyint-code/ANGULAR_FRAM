import { TestBed } from '@angular/core/testing';

import { ManagementNewsService } from './management-news.service';

describe('ManagementNewsService', () => {
  let service: ManagementNewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagementNewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
