import R from 'ramda'
import repeat from 'core-js/library/fn/string/repeat'

const len = (val) => typeof val === 'undefined' ? 0 : ('' + val).length
const padString = (character, width) => !width ? '' : repeat(character, width)
const stringifyRows = (rows) => {
  if (!Array.isArray(rows) || !rows.length) return []
  return rows.map((row) => row.map(JSON.stringify))
}
const insertColSeparators = (arr) => '│' + arr.join('│') + '│'
const getTopSeparatorLine = (colWidths) => getSeparatorLine('═', '╒', '╤', '╕', colWidths)
const getThickSeparatorLine = (colWidths) => getSeparatorLine('═', '╞', '╪', '╡', colWidths)
const getThinSeparatorLine = (colWidths) => getSeparatorLine('─', '├', '┼', '┤', colWidths)
const getBottomSeparatorLine = (colWidths) => getSeparatorLine('─', '└', '┴', '┘', colWidths)
const getSeparatorLine = (horChar, leftChar, crossChar, rightChar, colWidths) => {
  return leftChar + colWidths.map(function (w) {
    return padString(horChar, w)
  }).join(crossChar) + rightChar
}

const colWidths = (maxWidth, minWidth, input) => {
  if (!Array.isArray(input)) {
    return 0
  }
  return input[0].map((_, i) => {
    const tCol = R.pluck(i, input).map((col) => len(col))
    const measuredMax = Math.max(R.apply(Math.max, tCol), minWidth)
    return measuredMax > maxWidth && maxWidth > 0 ? maxWidth : measuredMax
  })
}

const rowHeights = (maxWidth, input) => {
  return input.map((row) => {
    const maxLen = R.apply(Math.max, row.map((col) => len(col)))
    const numLines = Math.ceil(maxLen / maxWidth)
    return numLines
  })
}

const splitRowsToLines = (maxWidth, heights, widths, input) => {
  return input.map((row, i) => {
    return row.map((col, colIndex) => {
      let lines = R.splitEvery(maxWidth, col)
      const lastLinesLen = len(R.last(lines))
      if (lastLinesLen < widths[colIndex]) {
        lines[lines.length - 1] = lines[lines.length - 1] + padString(' ', widths[colIndex] - lastLinesLen)
      }
      while (lines.length < heights[i]) {
        lines = [].concat(...lines, [padString(' ', widths[colIndex])])
      }
      return lines
    })
  })
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

const renderForWidth = (rows, maxColWidth = 30, minColWidth = 3) => {
  if (!Array.isArray(rows) || !rows.length) {
    return ''
  }
  maxColWidth = parseInt(maxColWidth)
  const widths = colWidths(maxColWidth, minColWidth, rows)
  const heights = rowHeights(maxColWidth, rows)
  const norm = splitRowsToLines(maxColWidth, heights, widths, rows)
  const header = createLines([R.head(norm)])
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
  tableFromSerializedData: (serializedRows, maxColumnWidth = 30) => renderForWidth(serializedRows, maxColumnWidth),
  table: (rows, maxColumnWidth = 30) => renderForWidth(stringifyRows(rows), maxColumnWidth),
  maxColumnWidth: (rows) => R.apply(Math.max, colWidths(0, 0, stringifyRows(rows)))
}
