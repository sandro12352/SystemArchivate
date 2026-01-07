import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComplete } from './profile-complete';

describe('ProfileComplete', () => {
  let component: ProfileComplete;
  let fixture: ComponentFixture<ProfileComplete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComplete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComplete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
