import { useQuery } from "@tanstack/react-query"
import fetchTables from "../../api/fetch-tables"
import { ITable } from "../../lib/types"

export default function () {
  const query = useQuery(["tables"], async (): Promise<ITable[]> => {
    const tables = await fetchTables()
    return tables
  })

  return query
}
