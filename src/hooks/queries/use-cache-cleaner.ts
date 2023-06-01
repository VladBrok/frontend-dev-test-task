import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export default function (queries: [string, { data: any }][]) {
  const queryClient = useQueryClient()
  const isCleaned = useRef(false)

  useEffect(() => {
    if (isCleaned.current || queries.some((query) => !query[1].data)) {
      return
    }

    isCleaned.current = true

    queries.forEach((key) => {
      queryClient.removeQueries([key])
    })
  }, [queryClient, queries])
}
