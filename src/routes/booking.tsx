import useTablesQuery from "../hooks/queries/use-tables-query"

export default function Booking() {
  const tablesQuery = useTablesQuery()

  return <>{JSON.stringify(tablesQuery.data)}</>
}
