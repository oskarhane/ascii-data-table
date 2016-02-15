# Ascii Data Table

This module provides functionality to render tables with text borders / outlines
so it can be pasted into the medium of choice.

The configuration is very limited by design, all that's configurable in the 
current version is the maximun width of the columns.

The API exposes only one method: `run(rows, [options])` where `rows` is expected to be 
an array with an index for every row, and eaxh row is also expected to be an array 
with one index for every column.  
All rows should have the same number of columns, and the first row is expected to 
be the header column with titles for each column.

```
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
npm install ascii-data-table
```

## Usage
Two packages are produced, one for [Node.js](https://nodejs.org/en/) environment and one for web browsers.

### In Node.js
Usage in Node.js varies depending if the will be used within a ES2015 application or not.

**In ES2015**

```
// If install with npm
import AsciiTable from ascii-data-table'

// or if installed by cloning git repo, use the correct path
//import AsciiTable from '../lib/ascii-data-table'

// The data to render
const items = [['x', 'y'], ['a', 'b'], ['c', 'd']]

// Render and save in 'res'
const res = AsciiTable.run(items)
```

**In ES 5.5**

```
// If install with npm
var AsciiTable = require('ascii-data-table').default

// or if installed by cloning git repo, use the correct path
//var AsciiTable = require('../lib/ascii-data-table').default

var items = [['x', 'y'], ['a', 'b'], ['c', 'd']]
var res = AsciiTable.run(items)
```

### In web browsers
A bundle for web browsers is created and can be found in `./lib`.

```
<script type="text/javascript" src="../lib/bundle.js"></script>
<script type="text/javascript">
  var items = [['x', 'y'], ['a', 'b'], ['c', 'd']]
  var output = AsciiTable.run(items)
  document.getElementById('my-table').innerHTML = output
  console.log(output)
</script>
```
## Examples / Demo
You can try online here: [Online demo](https://oskarhane-dropshare-eu.s3-eu-central-1.amazonaws.com/index-MAYXysKZJV/index.html)  
In the `./examples` folder there are examples for node and web browser environments.  
One cool thing in the browser demo is that you can hook up a range slider to the maximun 
width of the columns, giving this effect:  
![slider-gif-demo](https://oskarhane-dropshare-eu.s3-eu-central-1.amazonaws.com/ascii-data-table-slider-lfbBzm2sql/ascii-data-table-slider.gif)

## Testing
Run `npm test` to execute test in both Node.js and browser environments.  
Run `npm run test:watch` to have tests run on file changes.
