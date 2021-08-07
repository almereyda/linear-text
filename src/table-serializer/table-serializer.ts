import type {Table} from '../table/table'

/** Serialize a table to a tab-delimited value. */
export function serializeTable(table: Readonly<Table>): string {
  return table.lines
    .filter(({state}) => state !== 'draft')
    .map(({text}) => text)
    .join(table.newline)
}
