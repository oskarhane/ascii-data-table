/* global describe, it */

import expect from 'expect'
import AsciiTable from '../src/ascii-tables'

describe('Ascii Tables', () => {
  it('should generate a simple table', () => {
    const items = [['x'], ['a']]
    const res = AsciiTable.run(items)
    expect(res).toBe([
      '+===+',
      '|x  |',
      '+===+',
      '|a  |',
      '+---+'].join('\n')
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
})
