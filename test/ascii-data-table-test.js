/* global describe, it */

import expect from 'expect'
import AsciiTable from '../src/ascii-data-table'

function checkColWidth (AsciiTable, items, expectedLength) {
  const res = AsciiTable.getMaxColumnWidth(items)
  expect(res).toBe(expectedLength)
}

describe('Ascii Tables', () => {
  it('should not generate a table if no data', () => {
    const items = []
    const res = AsciiTable.run(items)
    expect(res).toBe('')
  })

  it('should not generate a table if input data isn\'t an array', () => {
    const items = 'Hello'
    const res = AsciiTable.run(items)
    expect(res).toBe('')
  })

  it('should generate a simple table', () => {
    const items = [['x'], ['a'], [true]]
    const res = AsciiTable.run(items)
    expect(res).toBe([
      '+====+',
      '|x   |',
      '+====+',
      '|a   |',
      '+----+',
      '|true|',
      '+----+'].join('\n')
    )
  })

  it('should generate a table with multiple columns and rows', () => {
    const items = [['x', 'y'], ['a', 'b'], ['c', 'd']]
    const res = AsciiTable.run(items)
    expect(res).toBe([
      '+===+===+',
      '|x  |y  |',
      '+===+===+',
      '|a  |b  |',
      '+---+---+',
      '|c  |d  |',
      '+---+---+'].join('\n')
    )
  })

  it('should respect linebreaks', () => {
    const items = [['x', 'y'], ['Hello,\nMy name is Oskar.\n\nWhat\'s your name?', 'b'], ['c', 'd']]
    const res = AsciiTable.run(items)
    expect(res).toBe([
      '+=================+===+',
      '|x                |y  |',
      '+=================+===+',
      '|Hello,           |b  |',
      '|My name is Oskar.|   |',
      '|                 |   |',
      "|What's your name?|   |",
      '+-----------------+---+',
      '|c                |d  |',
      '+-----------------+---+'].join('\n')
    )
  })

  it('should handle linebreak mania', () => {
    const items = [['x', 'y'], ['\na\n\n\naaa', 'b'], ['c', 'd\n\n\n\ndd\nd']]
    const res = AsciiTable.run(items)
    expect(res).toBe([
      '+===+===+',
      '|x  |y  |',
      '+===+===+',
      '|   |b  |',
      '|a  |   |',
      '|   |   |',
      '|   |   |',
      '|aaa|   |',
      '+---+---+',
      '|c  |d  |',
      '|   |   |',
      '|   |   |',
      '|   |   |',
      '|   |dd |',
      '|   |d  |',
      '+---+---+'].join('\n')
    )
  })

  it('should respect padded strings', () => {
    const items = [['x', 'y'], ['    a', 'b'], ['c', 'd    ']]
    const res = AsciiTable.run(items)
    expect(res).toBe([
      '+=====+=====+',
      '|x    |y    |',
      '+=====+=====+',
      '|    a|b    |',
      '+-----+-----+',
      '|c    |d    |',
      '+-----+-----+'].join('\n')
    )
  })

  it('should generate a table with numbers', () => {
    const items = [['x'], [2], [3], [[4, 5]]]
    const res = AsciiTable.run(items)
    expect(res).toBe([
      '+======+',
      '|x     |',
      '+======+',
      '|2     |',
      '+------+',
      '|3     |',
      '+------+',
      '|[4, 5]|',
      '+------+'].join('\n')
    )
  })

  it('should generate a table with arrays', () => {
    const items = [['x', 'y'], [['a', 'b'], 'ab'], [['c'], 'd']]
    const res = AsciiTable.run(items)
    expect(res).toBe([
      '+======+===+',
      '|x     |y  |',
      '+======+===+',
      '|[a, b]|ab |',
      '+------+---+',
      '|[c]   |d  |',
      '+------+---+'].join('\n')
    )
  })

  it('should generate a table with objects', () => {
    const items = [['x', 'y'], [{a: 'a', b: 'b'}, 'ab'], ['c', {d: 'd'}]]
    const res = AsciiTable.run(items)
    expect(res).toBe([
      '+============+======+',
      '|x           |y     |',
      '+============+======+',
      '|{a: a, b: b}|ab    |',
      '+------------+------+',
      '|c           |{d: d}|',
      '+------------+------+'].join('\n')
    )
  })

  it('should wrap long lines, including title row', () => {
    const items = [
      ['xxxxxx', 'yyyyyy'],
      ['aaaaa', 'bbb'],
      [{c: 'cccccc'}, ['ddddd']],
      ['string', 'verylongstring']
    ]
    const res = AsciiTable.run(items, {maxColumnWidth: 4})
    expect(res).toBe([
      '+====+====+',
      '|xxxx|yyyy|',
      '|xx  |yy  |',
      '+====+====+',
      '|aaaa|bbb |',
      '|a   |    |',
      '+----+----+',
      '|{c: |[ddd|',
      '|cccc|dd] |',
      '|cc} |    |',
      '+----+----+',
      '|stri|very|',
      '|ng  |long|',
      '|    |stri|',
      '|    |ng  |',
      '+----+----+'].join('\n')
    )
  })

  it('should find the max column width', () => {
    checkColWidth(AsciiTable, [['x', 'y'], [{a: 'a', b: 'b'}, 'ab'], ['c', {d: 'd'}]],
      12
    )
    checkColWidth(AsciiTable, [['xxxxxxxx', 'y'], ['a', 'ab'], ['c', {d: 'd'}]],
      8
    )
    checkColWidth(AsciiTable, [['xxxxxxxx', 'y'], ['a', 'ab'], ['c', "In the heart of the nation's capital, in a courthouse of the U.S. government, one man will stop at nothing to keep his honor, and one will stop at nothing to find the truth."]],
      173
    )
  })
})
