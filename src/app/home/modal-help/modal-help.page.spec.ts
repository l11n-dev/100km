import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalHelpPage } from './modal-help.page';

describe('ModalHelpPage', () => {
  let component: ModalHelpPage;
  let fixture: ComponentFixture<ModalHelpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalHelpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalHelpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
