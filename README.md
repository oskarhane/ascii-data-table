# Ascii Data Table

This module provides functionality to render tables with text borders / outlines
so it can be pasted into the medium of choice.

The configuration is very limited by design, all that's configurable in the 
current version is the maximun width of the columns.

The API exposes only two methods: `run(rows, [options])` where `rows` is expected to be 
an array with an index for every row, and each row is also expected to be an array 
with one index for every column, and `getMaxColumnWidth(rows)` to get the width of the 
widest column.  
All rows should have the same number of columns, and the first row is expected to 
be the header column with titles for each column.

```javascript
[
  ['first column', 'second column'], // title row
  ['my data row 1 col 1', 'my data row 1 col 2'], // first data row
  ['my data row 2 col 1', 'my data row 2 col 2'], // second data row
]
```

With default max width, the above would produce:

```
+===================+===================+
|first column       |second column      |
+===================+===================+
|my data row 1 col 1|my data row 1 col 2|
+-------------------+-------------------+
|my data row 2 col 1|my data row 2 col 2|
+-------------------+-------------------+
```

## Installation
Install with `npm` in your working directory:

```
npm install ascii-data-table --save
```

Install with `bower` in your working directory:

```
bower install ascii-data-table --save
```

## Usage
Two packages are produced, one for [Node.js](https://nodejs.org/en/) environment and one for web browsers.

### In Node.js
Usage in Node.js varies depending if the will be used within a ES2015 application or not.

**In ES2015**

```javascript
// If install with npm
import AsciiTable from 'ascii-data-table'

// or if installed by cloning git repo, use the correct path
//import AsciiTable from 'lib/ascii-data-table'

// The data to render
const items = [['x', 'y'], ['a', 'b'], ['c', 'd']]

// Not required, default is 30
const options = {maxColumnWidth: 15}

// Render and save in 'res'
const res = AsciiTable.run(items, options)
```

**In ES 5.5**

```javascript
// If install with npm
var AsciiTable = require('ascii-data-table').default

// or if installed by cloning git repo, use the correct path
//var AsciiTable = require('lib/ascii-data-table').default

var items = [['x', 'y'], ['a', 'b'], ['c', 'd']]
var res = AsciiTable.run(items)
```

### In web browsers
A bundle for web browsers is created and can be found in `lib`.

```html
<script type="text/javascript" src="/components/lib/bundle.js"></script>
<script type="text/javascript">
  var items = [['x', 'y'], ['a', 'b'], ['c', 'd']]
  var output = AsciiTable.run(items)
  document.getElementById('my-table').innerHTML = output
  console.log(output)
</script>
```

### For Angular 1.X
A bundle for Angular 1.X is created and can be found in `lib/bundle-angular.js` and 
assumes there's a global variable named `angular` available.

```html
<html>
  <head>
    <script type="text/javascript" src="/components/angular/angular.js"></script>
    <script type="text/javascript" src="/components/ascii-data-table/lib/bundle-angular.js"></script>
    <script type="text/javascript">
      var app = angular
        .module('myApp', ['AsciiTableModule'])
        .controller('TableController', ['$scope', 'AsciiTable', function($scope, AsciiTable){
          var items = [['x', 'y'], ['a', 'b'], ['c', 'd']]
          $scope.data = AsciiTable.run(items)
        }])
    </script>
  </head>
  <body ng-app="myApp">
    <pre id="table" ng-controller="TableController" ng-bind="data"></pre>
  </body>
</html>
```

## Examples / Demo
You can try online here: [Online demo](https://oskarhane-dropshare-eu.s3-eu-central-1.amazonaws.com/index-zcqLpvoR0Z/index.html)  
In the `examples` folder there are examples for node and web browser environments.  
One cool thing in the browser demo is that you can hook up a range slider to the maximun 
width of the columns, giving this effect:  
![slider-gif-demo](https://oskarhane-dropshare-eu.s3-eu-central-1.amazonaws.com/ascii-data-table-slider-lfbBzm2sql/ascii-data-table-slider.gif)

## Testing
Run `npm test` to execute test in both Node.js and browser environments.  
Run `npm run test:watch` to have tests run on file changes.

## Contributing
All bug reports, feature requests and pull requests are welcome. This project uses the [Javascript Standard Style](http://standardjs.com) and a lint check will run before all tests and builds.
