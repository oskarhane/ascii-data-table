/* global describe, it */

import expect from 'expect'
import repeat from 'core-js/library/fn/string/repeat'
import AsciiTable from '../src/ascii-data-table'

function checkColWidth (AsciiTable, items, expectedLength) {
  const res = AsciiTable.maxColumnWidth(items)
  expect(res).toEqual(expectedLength)
}

describe('Ascii Tables', () => {
  it('should not generate a table if no data', () => {
    const items = []
    const res = AsciiTable.table(items)
    expect(res).toEqual('')
  })

  it('should not generate a table if input data isn\'t an array', () => {
    const items = 'Hello'
    const res = AsciiTable.table(items)
    expect(res).toEqual('')
  })

  it('should generate a simple table', () => {
    const items = [['x'], ['a'], [true]]
    const res = AsciiTable.table(items)
    expect(res).toEqual([
      '╒════╕',
      '│"x" │',
      '╞════╡',
      '│"a" │',
      '├────┤',
      '│true│',
      '└────┘'].join('\n')
    )
  })

  it('should generate a table with multiple columns and rows', () => {
    const items = [['x', 'y'], ['a', 'b'], ['c', 'd']]
    const res = AsciiTable.table(items)
    expect(res).toEqual([
      '╒═══╤═══╕',
      '│"x"│"y"│',
      '╞═══╪═══╡',
      '│"a"│"b"│',
      '├───┼───┤',
      '│"c"│"d"│',
      '└───┴───┘'].join('\n')
    )
  })

  it('should escape linebreaks', () => {
    const items = [['x', 'y'], ['Hello,\nMy name is Oskar.\n\nWhat\'s your name?', 'b'], ['c', 'd']]
    const res = AsciiTable.table(items, 100)
    expect(res).toEqual([
      '╒════════════════════════════════════════════════╤═══╕',
      '│"x"                                             │"y"│',
      '╞════════════════════════════════════════════════╪═══╡',
      '│"Hello,\\nMy name is Oskar.\\n\\nWhat\'s your name?"│"b"│', // Look weird b/c of escape
      '├────────────────────────────────────────────────┼───┤',
      '│"c"                                             │"d"│',
      '└────────────────────────────────────────────────┴───┘'].join('\n')
    )
  })

  it('should not make columns shorter than 3', () => {
    const items = [[1], [1]]
    const res = AsciiTable.table(items)
    expect(res).toEqual([
      '╒═══╕',
      '│1  │',
      '╞═══╡',
      '│1  │',
      '└───┘'].join('\n')
    )
  })

  it('should respect padded strings', () => {
    const items = [['x', 'y'], ['    a', 'b'], ['c', 'd    ']]
    const res = AsciiTable.table(items)
    expect(res).toEqual([
      '╒═══════╤═══════╕',
      '│"x"    │"y"    │',
      '╞═══════╪═══════╡',
      '│"    a"│"b"    │',
      '├───────┼───────┤',
      '│"c"    │"d    "│',
      '└───────┴───────┘'].join('\n')
    )
  })

  it('should generate a table with numbers', () => {
    const items = [['x'], [2], [3], [[4, 5]]]
    const res = AsciiTable.table(items)
    expect(res).toEqual([
      '╒═════╕',
      '│"x"  │',
      '╞═════╡',
      '│2    │',
      '├─────┤',
      '│3    │',
      '├─────┤',
      '│[4,5]│',
      '└─────┘'].join('\n')
    )
  })

  it('should generate a table with arrays', () => {
    const items = [['x', 'y'], [['a', 'b'], 'ab'], [['c'], 'd']]
    const res = AsciiTable.table(items)
    expect(res).toEqual([
      '╒═════════╤════╕',
      '│"x"      │"y" │',
      '╞═════════╪════╡',
      '│["a","b"]│"ab"│',
      '├─────────┼────┤',
      '│["c"]    │"d" │',
      '└─────────┴────┘'].join('\n')
    )
  })

  it('should generate a table with arrays, with different widths', () => {
    const items = [['x', 'y'], [['a', 'b'], 'ab'], [['c'], 'd']]
    const res = AsciiTable.table(items)
    const res2 = AsciiTable.table(items, 7)
    expect(res).toEqual([
      '╒═════════╤════╕',
      '│"x"      │"y" │',
      '╞═════════╪════╡',
      '│["a","b"]│"ab"│',
      '├─────────┼────┤',
      '│["c"]    │"d" │',
      '└─────────┴────┘'].join('\n')
    )
    expect(res2).toEqual([
      '╒═══════╤════╕',
      '│"x"    │"y" │',
      '╞═══════╪════╡',
      '│["a","b│"ab"│',
      '│"]     │    │',
      '├───────┼────┤',
      '│["c"]  │"d" │',
      '└───────┴────┘'].join('\n')
    )
  })

  it('should cast maxWidth to int', () => {
    const items = [['x', 'y'], [['a', 'b'], 'ab'], [['c'], 'd']]
    const res = AsciiTable.table(items, '7')
    expect(res).toEqual([
      '╒═══════╤════╕',
      '│"x"    │"y" │',
      '╞═══════╪════╡',
      '│["a","b│"ab"│',
      '│"]     │    │',
      '├───────┼────┤',
      '│["c"]  │"d" │',
      '└───────┴────┘'].join('\n')
    )
  })

  it('should generate a table with objects', () => {
    const items = [['x', 'y'], [{a: 'a', b: 'b'}, 'ab'], ['c', {d: 'd'}]]
    const res = AsciiTable.table(items)
    expect(res).toEqual([
      '╒═════════════════╤═════════╕',
      '│"x"              │"y"      │',
      '╞═════════════════╪═════════╡',
      '│{"a":"a","b":"b"}│"ab"     │',
      '├─────────────────┼─────────┤',
      '│"c"              │{"d":"d"}│',
      '└─────────────────┴─────────┘'].join('\n')
    )
  })

  it('should wrap long lines, including title row', () => {
    const items = [
      ['xxxxxx', 'yyyyyy'],
      ['aaaaa', 'bbb'],
      [{c: 'cccccc'}, ['ddddd']],
      ['string', 'verylongstring']
    ]
    const res = AsciiTable.table(items, 4)
    expect(res).toEqual([
      '╒════╤════╕',
      '│"xxx│"yyy│',
      '│xxx"│yyy"│',
      '╞════╪════╡',
      '│"aaa│"bbb│',
      '│aa" │"   │',
      '├────┼────┤',
      '│{"c"│["dd│',
      '│:"cc│ddd"│',
      '│cccc│]   │',
      '│"}  │    │',
      '├────┼────┤',
      '│"str│"ver│',
      '│ing"│ylon│',
      '│    │gstr│',
      '│    │ing"│',
      '└────┴────┘'].join('\n')
    )
  })

  it('should be able to generate very wide tables', () => {
    const len = 100000
    const items = [['x', 'y'], [repeat('x', len), 'hey']]
    const res = AsciiTable.table(items, 9999999999)
    expect(res).toEqual([
      '╒' + repeat('═', len + 2) + '╤═════╕',
      '│"x"' + repeat(' ', len - 1) + '│"y"  │',
      '╞' + repeat('═', len + 2) + '╪═════╡',
      '│"' + repeat('x', len) + '"│"hey"│',
      '└' + repeat('─', len + 2) + '┴─────┘'].join('\n')
    )
  })

  it('should find the max column width', () => {
    checkColWidth(AsciiTable, [['x', 'y'], [{a: 'a', b: 'b'}, 'ab'], ['c', {d: 'd'}]],
      JSON.stringify({a: 'a', b: 'b'}).length
    )
    checkColWidth(AsciiTable, [['xxxxxxxx', 'y'], ['a', 'ab'], ['c', {d: 'd'}]],
      JSON.stringify('xxxxxxxx').length
    )
    checkColWidth(AsciiTable, [['xxxxxxxx', 'y'], ['a', 'ab'], ['c', "In the heart of the nation's capital, in a courthouse of the U.S. government, one man will stop at nothing to keep his honor, and one will stop at nothing to find the truth."]],
      JSON.stringify("In the heart of the nation's capital, in a courthouse of the U.S. government, one man will stop at nothing to keep his honor, and one will stop at nothing to find the truth.").length
    )
  })
})
