import AsciiTable from '../src/ascii-data-table'

module.exports = (props) =>
  <pre style={{width: 300, height: 300}}>{AsciiTable.run(props.rows)}</pre>
