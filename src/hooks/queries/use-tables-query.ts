import { useQuery } from "@tanstack/react-query"
import fetchTables from "../../api/fetch-tables"
import { ITable } from "../../lib/types"
import { QUERY_KEYS } from "../../lib/query-keys"

export default function () {
  const query = useQuery([QUERY_KEYS.TABLES], async (): Promise<ITable[]> => {
    const tables = await fetchTables()
    return tables
  })

  return query
}
