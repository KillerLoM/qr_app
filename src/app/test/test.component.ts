import { Component, Input } from '@angular/core';
import { Ginseng } from '../ginseng';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  @Input()
  inputGinseng: Ginseng[] | null = null;
ginsengInput: any;
  constructor(){
  }
}
