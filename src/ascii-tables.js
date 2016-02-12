const getArray = (len) => Array.apply(null, Array(len)).map((_, i) => i)

const stringifyVal = (val) => {
  if (Array.isArray(val)) return stringifyArray(val)
  if (typeof val === 'number') return val
  if (typeof val === 'string') return val
  if (val === null) return '(null)'
  if (typeof val === 'object') return stringifyObject(val)
}

const stringifyArray = (arr) => '[' + arr.map(stringifyVal).join(', ') + ']'

const stringifyObject = (obj) => {
  if (typeof obj !== 'object') return obj
  return '{' + Object.keys(obj).map((key) => key + ': ' + stringifyVal(obj[key])).join(', ') + '}'
}

const stringifyLines = (rows) => {
  if (!rows) return []
  return rows.map((row) => row.map(stringifyVal))
}

const getRowIndexForLine = (rowHeights, lineNumber) => {
  return rowHeights.reduce((meta, height, rowIndex) => {
    if (!(meta.remainingLines >= 0)) {
      return meta
    }
    meta.rowIndex = rowIndex
    if (meta.remainingLines < height) {
      meta.lineIndex = meta.remainingLines
    }
    meta.remainingLines = meta.remainingLines - height
    return meta
  }, {
    rowIndex: 0,
    lineIndex: 0,
    remainingLines: lineNumber
  })
}

const getLineFromRow = (prev, col, colIndex) => {
  let colLines = col.match(new RegExp('.{1,' + prev.colWidths[colIndex] + '}', 'g')) || ['']
  colLines = colLines.concat([getArray(prev.rowHeight - colLines.length).map((a) => '')])
  const linesStr = colLines
    .filter((_, lineIndex) => lineIndex === prev.lineIndex)
    .map((line) => line + padString(' ', prev.colWidths[colIndex] - line.length))
  prev.lines.push(linesStr)
  return prev
}

const getColWidths = (rows) => {
  return getArray(rows[0].length).map((i) => {
    return rows.reduce((prev, curr) => {
      return Math.max(prev, curr[i].length)
    }, 0)
  })
}

const renderForWidth = (rows, maxColWidth, minColWidth) => {
  if (maxColWidth == null) {
    maxColWidth = 30
  }
  if (minColWidth == null) {
    minColWidth = 3
  }
  if (!rows.length) {
    return ''
  }
  const colWidths = getColWidths(rows).map((colWidth) => {
    return Math.max(Math.min(colWidth, maxColWidth), minColWidth)
  })
  const rowHeights = rows.map((row) => {
    return row.reduce((prev, curr, colIndex) => {
      return Math.max(1, Math.max(prev, Math.ceil(curr.length / colWidths[colIndex])))
    }, 0)
  })
  const totalLines = rowHeights.reduce((tot, curr) => {
    return tot + curr
  }, 0)
  let output = getArray(totalLines).reduce((out, _, i) => {
    const lineMeta = getRowIndexForLine(rowHeights, i)
    const rowLines = rows[lineMeta.rowIndex].reduce(getLineFromRow, {
      lines: [],
      lineIndex: lineMeta.lineIndex,
      rowHeight: rowHeights[lineMeta.rowIndex],
      colWidths: colWidths
    }).lines.join('|')
    out.push('|' + rowLines + '|')
    return out
  }, [])
  output = insertRowSeparators(output, rowHeights, colWidths)
  return output.join('\n')
}

const insertRowSeparators = (lines, rowHeights, colWidths) => {
  return rowHeights.reduce((out, rowHeight, rowIndex) => {
    out.curr.push.apply(out.curr, out.feeder.splice(0, rowHeight))
    if (rowIndex !== 0) out.curr.push(getThinSeparatorLine(colWidths))
    if (rowIndex === 0) out.curr.push(getThickSeparatorLine(colWidths))
    return out
  }, {
    feeder: lines,
    curr: [getThickSeparatorLine(colWidths)]
  }).curr
}

const getThickSeparatorLine = (colWidths) => getSeparatorLine('=', '+', colWidths)
const getThinSeparatorLine = (colWidths) => getSeparatorLine('-', '+', colWidths)
const getSeparatorLine = (horChar, vertChar, colWidths) => {
  return vertChar + colWidths.map((w) => {
    return padString(horChar, w)
  }).join(vertChar) + vertChar
}

const padString = (character, width) => {
  if (!(width > 0)) {
    return ''
  }
  return getArray(width).map(() => character).join('')
}

export default {
  run: (rows, options = {maxColumnWidth: 30}) => renderForWidth(stringifyLines(rows), options.maxColumnWidth)
}

