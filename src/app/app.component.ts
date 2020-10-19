import { Component, OnInit } from '@angular/core';
import { Select2DataSource } from 'smpl-select2';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'smpl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  simpleDataSource: Select2DataSource = {};
  asyncDataSource: Select2DataSource = {};

  ngOnInit(): void {
    setTimeout(() => {
      this.simpleDataSource = {
        data: [
          { value: 1, title: 'Option 1' },
          { value: 2, title: 'Option 2' },
          { value: 3, title: 'Option 3' },
          { value: 4, title: 'Option 4' }
        ]
      };
    }, 2000);

    this.asyncDataSource = {
      ajaxFn: (searchText) => {
        console.log(`Searching for: "${searchText}"`);
        return of([
          { id: 1, text: 'Option 1' },
          { id: 2, text: 'Option 2' },
          { id: 3, text: 'Option 3' },
          { id: 4, text: 'Option 4' }
        ]).pipe(
          delay(2000)
        );
      },
      ajaxDelay: 2000
    };
  }

  public selectOption(option: any): void {
    alert(JSON.stringify(option));
  }

}
