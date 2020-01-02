import { Component } from '@angular/core';
import { Select2DataSource } from 'smpl-select2';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'smpl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  simpleDataSource: Select2DataSource = {
    data: [
      { id: 1, text: 'Option 1' },
      { id: 2, text: 'Option 2' },
      { id: 3, text: 'Option 3' },
      { id: 4, text: 'Option 4' }
    ]
  };

  asyncDataSource: Select2DataSource = {
    ajaxFn: of([
      { id: 1, text: 'Option 1' },
      { id: 2, text: 'Option 2' },
      { id: 3, text: 'Option 3' },
      { id: 4, text: 'Option 4' }
    ]).pipe(
      delay(2000)
    ),
    ajaxDelay: 1000
  }

  public selectOption(option: any): void {
    alert(JSON.stringify(option));
  }

}
