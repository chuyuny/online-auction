import { TestBed } from '@angular/core/testing';

import { WebsocktService } from './websockt.service';

describe('WebsocktService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebsocktService = TestBed.get(WebsocktService);
    expect(service).toBeTruthy();
  });
});
