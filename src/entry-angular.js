/* global angular */
import AsciiTable from '../src/ascii-data-table'

module.exports = angular.module('AsciiTableModule', [])
  .service('AsciiTable', () => AsciiTable)
