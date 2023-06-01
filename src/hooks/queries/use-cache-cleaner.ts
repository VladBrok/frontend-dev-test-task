import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export default function (queryKeys: string[]) {
  const queryClient = useQueryClient()
  const isCleaned = useRef(false)

  useEffect(() => {
    if (isCleaned.current) {
      return
    }

    console.log("clean")

    isCleaned.current = true

    queryKeys.forEach((key) => {
      queryClient.removeQueries([key])
    })
  }, [queryClient, queryKeys])
}
