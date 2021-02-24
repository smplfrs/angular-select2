# Prerequisites

Install [JQuery](https://www.npmjs.com/package/jquery)
```
npm i -s jquery
```

Include JQuery in your `angular.json` file
```
"scripts": [
  "node_modules/jquery/dist/jquery.js"
],
```

# Get started

Install package
```
npm i -s @smplfrs/angular-select2
```

Include default styles in your `angular.json` file
```
"styles": [
  "node_modules/select2/dist/css/select2.min.css"
],
```

Import the `SmplSelect2Module` in your app module

```typescript
import { SmplSelect2Module } from '@smplfrs/angular-select2';
...
@NgModule({
  ...
  imports: [
    SmplSelect2Module
  ],
  ...
})
```

## Usage

### Static options

**static-options.component.html**
```html
<select smplSelect2 static>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</select>
```


### Dynamic options

**dynamic-options.component.html**
```html
<select smplSelect2 [dataSource]="dataSource">
</select>
```

**dynamic-options.component.ts**
```typescript
dataSource = {
  data: [
    { id: 1, text: 'Option 1' },
    { id: 2, text: 'Option 2' },
    { id: 3, text: 'Option 3' }
  ]
};
```


### Async data source

**async-data.component.html**
```html
<select smplSelect2 [dataSource]="dataSource">
</select>
```

**async-data.component.ts**
```typescript
dataSource = {
  ajaxFn: of([
    { id: 1, text: 'Option 1' },
    { id: 2, text: 'Option 2' },
    { id: 3, text: 'Option 3' }
  ]),
  ajaxDelay: 1000
};
```

## API reference

### Input
| Name              | Type                                      | Default   | Description  |
| ------------------|-------------------------------------------|:---------:|--------------|
| `smplSelect2`     | [Select2Config](#select2config)           |           | Configuration options for the control. |
| `static`          | boolean                                   | false     | Whether dropdown options should be rendered from html `<options>` tags. |
| `dataSource`      | [Select2DataSource](#select2datasource)   |           | Dynamic data source for dropdown options when `static` is set to `false`. |
| `displayProperty` | string                                    | 'text'    | The property of dropdown option object used to display in selection panel. |
| `valueProperty`   | string                                    | 'id'      | The property of dropdown option object used as identifier. |
| `placeholder`     | string                                    | '(NONE)'  | The placeholder for the control. |


### Output
| Name      | Type          | Description  |
| ----------|---------------| -------------|
| `select`  | Select2Option | Emitted when selection changed.  |


### Class

#### Select2Config

See [select2 configuration options](https://select2.org/configuration/options-api).

#### Select2DataSource

| Name              | Type                              | Description  |
| ------------------|-----------------------------------| -------------|
| `data`            | any[]                             | A data array to render dropdown options.  |
| `ajaxFn`          | Observable<any[]>                 | An async data source called when opening the dropdown.  |
| `ajaxDelay`       | number                            | Delay time to execute `ajaxFn`.  |
| `dataTransformFn` | (data: any[]) => Select2Option[]  | Optional custom function to transform raw data into Select2Option.  |

