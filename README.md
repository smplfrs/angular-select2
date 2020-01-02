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

# Installation

Install package
```
npm i @smplfrs/smpl-select2
```

Include default styles in your `angular.json` file
```
"styles": [
  "node_modules/select2/dist/css/select2.min.css"
],
```

# Usage

## Static options
```html
<select smpl-select2 [static]="true">
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</select>
```

## Dynamic options

HTML
```html
<select smpl-select2 [dataSource]="dataSource">
</select>
```

TS
```javascript
dataSource = {
  data: [
    { id: 1, text: 'Option 1' },
    { id: 2, text: 'Option 2' },
    { id: 3, text: 'Option 3' }
  ]
};
```

## Async data source

HTML
```html
<select smpl-select2 [dataSource]="dataSource">
</select>
```

TS
```javascript
dataSource = {
  ajaxFn: of([
    { id: 1, text: 'Option 1' },
    { id: 2, text: 'Option 2' },
    { id: 3, text: 'Option 3' }
  ]),
  ajaxDelay: 1000
};
```
