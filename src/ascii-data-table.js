import * as R from './functions'
import repeat from 'core-js/library/fn/string/repeat'

const len = (val) => typeof val === 'undefined' ? 0 : ('' + val).length
const arrLen = (arr) => arr.length
const arrMax = (arr) => R.apply(Math.max, arr)
const matrixCol = (matrix) => (colNr) => R.pluck(colNr, matrix)
const padString = (character) => (width) => !width ? '' : repeat(character, width)
const spacePad = padString(' ')
const stringifyArray = R.cMap(JSON.stringify)
const stringifyRows = (rows) => R.EitherArray(rows).fold(() => null, R.cMap(stringifyArray))
const insertColSeparators = (arr) => '│' + arr.join('│') + '│'
const getTopSeparatorLine = (colWidths) => getSeparatorLine('═', '╒', '╤', '╕', colWidths)
const getThickSeparatorLine = (colWidths) => getSeparatorLine('═', '╞', '╪', '╡', colWidths)
const getThinSeparatorLine = (colWidths) => getSeparatorLine('─', '├', '┼', '┤', colWidths)
const getBottomSeparatorLine = (colWidths) => getSeparatorLine('─', '└', '┴', '┘', colWidths)
const getSeparatorLine = (horChar, leftChar, crossChar, rightChar, colWidths) => {
  return leftChar + colWidths.map(function (w) {
    return padString(horChar)(w)
  }).join(crossChar) + rightChar
}

const colWidths = (maxWidth, minWidth, input) => {
  const inputEither = R.EitherArray(input)
  const columnAtIndex = matrixCol(input)
  const normalizeWidth = (w) => Math.min(Math.max(w, minWidth), (maxWidth || Infinity))
  return inputEither
          .map((r) => R.head(r)[0]) // Grab title row
          .map(arrLen)              // Get the number of columns
          .map(R.array)             // Create a new array with same number of columns
          .map(R.cMap(columnAtIndex))  // Populate new array with columns from input
          .map(R.cMap(R.cMap(len)))  // Measure the width of every column of every row
          .map(R.cMap(arrMax))  // Grab the max width of every column
          .map(R.cMap(normalizeWidth)) // Normalize width to be within limits
          .fold(() => [0], R.id)  // default to 0
}

const rowHeights = (maxWidth, input) => {
  return input.map((row) => {
    const maxLen = arrMax(row.map(len))
    const numLines = Math.ceil(maxLen / maxWidth)
    return numLines
  })
}

const rowsToLines = (maxWidth, heights, widths, input) => {
  const columnToLinesWidths = columnToLines(widths, maxWidth)
  return input.map((row, i) => {
    return row.map(columnToLinesWidths(heights[i]))
  })
}

const columnToLines = (widths, maxWidth) => (rowHeight) => (col, colIndex) => {
  let lines = R.splitEvery(maxWidth, col)
  lines[lines.length - 1] += spacePad(widths[colIndex] - len(R.last(lines)))
  while (lines.length < rowHeight) {
    lines.push(spacePad(widths[colIndex]))
  }
  return lines
}

const createLines = (rows) => {
  return rows.reduce((lines, row) => {
    if (!Array.isArray(row)) {
      return [].concat(lines, row)
    }
    const tRow = R.transpose(row).map(insertColSeparators)
    return [].concat(lines, tRow)
  }, [])
}

const main = (rows, maxColWidth = 30, minColWidth = 3) => {
  if (!Array.isArray(rows) || !rows.length) {
    return ''
  }
  maxColWidth = parseInt(maxColWidth)
  const widths = colWidths(maxColWidth, minColWidth, rows)
  const heights = rowHeights(maxColWidth, rows)
  const norm = rowsToLines(maxColWidth, heights, widths, rows)
  const header = createLines(R.head(norm))
  const separated = R.intersperse(getThinSeparatorLine(widths), R.tail(norm))
  const lines = createLines(separated)
  return [
    getTopSeparatorLine(widths),
    ...header,
    getThickSeparatorLine(widths),
    ...lines,
    getBottomSeparatorLine(widths)
  ].join('\n')
}

export default {
  serializeData: (rows) => stringifyRows(rows),
  tableFromSerializedData: (serializedRows, maxColumnWidth = 30) => main(serializedRows, maxColumnWidth),
  table: (rows, maxColumnWidth = 30) => main(stringifyRows(rows), maxColumnWidth),
  maxColumnWidth: (rows) => arrMax(colWidths(0, 0, stringifyRows(rows)))
}
