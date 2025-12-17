import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePasswordCompenent } from './update-password-compenent';

describe('UpdatePasswordCompenent', () => {
  let component: UpdatePasswordCompenent;
  let fixture: ComponentFixture<UpdatePasswordCompenent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePasswordCompenent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePasswordCompenent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
